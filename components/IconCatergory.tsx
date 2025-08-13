import { icons } from 'lucide-react-native';

export type IconName = keyof typeof icons;

const IconCategory = ({ name, color, size }: { name: IconName, color?: string, size: number }) => {
  const LucideIcon = icons[name];

  return <LucideIcon color={color || 'black'} size={size} />;
};

export default IconCategory;