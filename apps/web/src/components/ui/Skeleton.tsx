export function SkeletonLine({
  width = 'w-full',
  height = 'h-3',
  className = '',
}: {
  width?: string;
  height?: string;
  className?: string;
}) {
  return <div aria-hidden className={`bg-gray-200 rounded-full animate-pulse ${height} ${width} ${className}`} />;
}

export function SkeletonBox({
  width = 'w-full',
  height = 'h-10',
  className = '',
}: {
  width?: string;
  height?: string;
  className?: string;
}) {
  return <div aria-hidden className={`bg-gray-200 rounded-xl animate-pulse ${height} ${width} ${className}`} />;
}

export function SkeletonCircle({
  size = 'w-10 h-10',
  className = '',
}: {
  size?: string;
  className?: string;
}) {
  return <div aria-hidden className={`bg-gray-200 rounded-full animate-pulse shrink-0 ${size} ${className}`} />;
}
