// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::blocking::get;
use serde::Deserialize;
use std::{env, fs, net::TcpStream, thread, time::Duration};
use tauri::api::{path, process::Command};

#[derive(Deserialize, Debug)]
struct App {
    version: String,
    image: String,
    digest: String,
}

#[derive(Deserialize, Debug)]
struct Prem {
    daemon: App,
}

#[derive(Deserialize, Debug)]
struct Config {
    prem: Prem,
}

#[tauri::command]
fn run_container() {
    // check if docker is running
    let docker_check = is_docker_running();
    if !docker_check {
        println!("Docker is not running");
        return;
    }

    //pull versions.json from GitHub repository prem-box
    let url = "https://raw.githubusercontent.com/premAI-io/prem-box/main/versions.json";
    let response = get(url).expect("Request failed");
    let config: Config = response.json().expect("Failed to parse JSON");

    let image = format!(
        "{}:{}@{}",
        config.prem.daemon.image, config.prem.daemon.version, config.prem.daemon.digest
    );

    println!("Using image: {}", image);

    Command::new("/usr/local/bin/docker")
        .args(&[
            "run",
            "-d",
            "-v",
            "/var/run/docker.sock:/var/run/docker.sock",
            "-p",
            "54321:8000",
            "--name",
            "premd",
            "-e",
            "PREM_REGISTRY_URL=https://raw.githubusercontent.com/premAI-io/prem-daemon/main/resources/mocks/manifests.json",
            "--rm",
            image.as_str(),
        ])
        .output()
        .expect("Failed to execute docker run");
}

#[tauri::command]
fn is_docker_running() -> bool {
    let output = Command::new("/usr/bin/pgrep")
        .args(["Docker"])
        .output()
        .map_err(|e| {
            println!("Failed to execute docker info: {}", e);
            e
        });

    if !output.unwrap().stdout.is_empty() {
        return true;
    }
    return false;
}

#[tauri::command]
fn is_container_running() -> Result<bool, String> {
    let output = Command::new("/usr/local/bin/docker")
        .args(&["ps", "-q", "-f", "name=premd"])
        .output()
        .map_err(|e| format!("Failed to execute command: {}", e))?;

    Ok(!output.stdout.is_empty())
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let config = app.config().clone();
            let app_dir = path::app_data_dir(&config).expect("Failed to get app directory");
            let app_dir_str = app_dir.to_string_lossy().to_string();
            fs::create_dir_all(&app_dir).expect("Failed to create app data directory");
            println!("App directory: {}", app_dir_str);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            run_container,
            is_docker_running,
            is_container_running,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
