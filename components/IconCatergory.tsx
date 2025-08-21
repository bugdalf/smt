import { icons } from 'lucide-react-native';

export type IconName = keyof typeof icons;

const IconCategory = ({ name, color, size, bgColor }: { name: IconName, color?: string, size: number, bgColor?: string }) => {
  const LucideIcon = icons[name];

  return <LucideIcon color={color || 'black'} size={size} style={{ backgroundColor: bgColor }} />;
};

export default IconCategory;