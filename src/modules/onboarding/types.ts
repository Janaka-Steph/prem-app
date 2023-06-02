import { ReactElement } from "react";

export type WelcomeScreenProps = {
  close: () => void;
};

export type SystemCheckProps = {
  handleCheckIsDockerRunning: () => void;
  isDockerRunning: boolean;
  isServerRunning: boolean;
  back: () => void;
  next: () => void;
};

export type DependencyProps = {
  isRunning: boolean;
  name: string;
  status: string;
  tooltip?: string | ReactElement;
};

export type OnboardingProps = {
  redirectTo: ReactElement;
};
