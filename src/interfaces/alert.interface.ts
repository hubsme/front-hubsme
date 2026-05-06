export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'delete';

export interface AlertButton {
  text: string;
  style: 'primary' | 'secondary' | 'danger' | 'success';
  action: () => void;
}

export interface AlertMessage {
  id: number;
  type: AlertType;
  title: string;
  message: string;
  buttons: AlertButton[];
}
