export function getInitials(firstName: string, lastName: string): string {
  return `${(firstName?.[0] || '').toUpperCase()}${(lastName?.[0] || '').toUpperCase()}`;
}

export function Avatar({ firstName, lastName, size = 36 }: { firstName: string; lastName: string; size?: number }) {
  const initials = getInitials(firstName, lastName);
  // deterministic bg based on name
  const colors = ['#EAE7F8', '#EBF5EB', '#E0F2FE', '#FEF3C7', '#FDEAEA', '#EEECF7'];
  const idx = (firstName.charCodeAt(0) + lastName.charCodeAt(0)) % colors.length;
  const bg = colors[idx];
  const textColors: Record<string, string> = {
    '#EAE7F8': '#2D1B8B',
    '#EBF5EB': '#1A7A1A',
    '#E0F2FE': '#0369A1',
    '#FEF3C7': '#B45309',
    '#FDEAEA': '#CC0000',
    '#EEECF7': '#5A5480',
  };

  return (
    <div
      className="rounded-full flex items-center justify-center font-semibold shrink-0"
      style={{ width: size, height: size, background: bg, color: textColors[bg] || '#2D1B8B', fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
}
