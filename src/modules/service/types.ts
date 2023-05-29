import { App } from "modules/dashboard/types";
import { PropsWithChildren } from "react";

export type CheckeBoxProps = {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type DropdownProps = {
  open: boolean;
  close: () => void;
  apps: App[];
  search: Map<string, boolean>;
  onChange: (appId: string, status: boolean) => void;
};

export type ModelInfo = {
  inferenceTime: string;
  maxLength: number;
  memoryRequirements: string;
  tokenLimit: number;
  weightsName: string;
  weightsSize: number;
};

export type Service = {
  interfaces: string[];
  defaultPort: number;
  description: string;
  dockerImage: string;
  documentation: string;
  downloaded: boolean;
  icon: string;
  id: string;
  modelInfo: ModelInfo;
  name: string;
  running: boolean;
  supported: boolean;
  runningPort: number;
};

export type SearchFilterProps = {
  apps: App[];
  onFilterChange: (e: Map<string, boolean>) => void;
  appId: string;
};

export type Option = {
  label: string;
  value: string;
};

export type Stats = {
  cpu_percentage: number;
  memory_usage: number;
  memory_limit: number;
  memory_percentage: number;
  storage_usage: number;
  storage_limit: number;
  storage_percentage: number;
};

export type GPUStats = {
  gpu_name: string | null,
  total_memory: number | null,
  used_memory: number | null,
  memory_percentage: number | null,
}

export type Message = {
  message: string;
};

export type ServiceStateProps = {
  serviceId: string;
  refetch: () => void;
};

export type ServiceStatus =
  | "running"
  | "stopped"
  | "not_supported"
  | "not_downloaded"
  | "service_greater_than_free_memory"
  | "service_greater_than_limit_memory";


export type ServiceCardProps = {
  title: string;
  className: string;
  icon: string;
  status: ServiceStatus;
  serviceId: string;
};

export type ServiceActionsProps = PropsWithChildren<{
  status: ServiceStatus;
  serviceId: string;
  refetch: () => void;
}>;

export type WarningServiceStateProps = {
  status: ServiceStatus;
};

export type ServiceStats = {
  id: string;
  cpu_percentage: number;
  memory_usage: number;
  memory_limit: number;
  memory_percentage: number;
  storage_percentage: number;
  storage_usage: number;
  storage_limit: number;
};
