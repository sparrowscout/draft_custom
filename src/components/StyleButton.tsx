import { colorStyleMap, styles } from './styles';

interface StyleButtonProps {
  active: boolean;
  onToggle: () => void;
  label: string;
  style: keyof typeof colorStyleMap;
}

export default function StyleButton({ active, label, onToggle, style }: StyleButtonProps) {
  const spanStyle = active
    ? { ...styles.styleButton, ...colorStyleMap[style] }
    : styles.styleButton;
  return (
    <span style={spanStyle} onMouseDown={onToggle}>
      {label}
    </span>
  );
}
