import styled from 'styled-components';
import { colorStyleMap, styles } from './styles';
import StyleButton from './StyleButton';

interface ColorControlsProps {
  editorState: any;
  onToggle: (color: string) => void;
}

interface ColorsInterface {
  label: string;
  style: keyof typeof colorStyleMap;
}

export default function ColorControls({ editorState, onToggle }: ColorControlsProps) {
  const COLORS: ColorsInterface[] = [
    { label: 'Red', style: 'red' },
    { label: 'Orange', style: 'orange' },
    { label: 'Yellow', style: 'yellow' },
    { label: 'Green', style: 'green' },
    { label: 'Blue', style: 'blue' },
    { label: 'Indigo', style: 'indigo' },
    { label: 'Violet', style: 'violet' },
  ];
  const currentStyle = editorState.getCurrentInlineStyle();
  return (
    <div style={styles.styleButton}>
      {COLORS.map((type) => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={() => onToggle(type.style)}
          style={type.style}
        />
      ))}
    </div>
  );
}
