/**
 * ColorSwatches — دوائر ألوان قابلة للاختيار، تعرض اسم اللون النشط.
 */
export default function ColorSwatches({ colors, selected, onSelect }) {
  if (!colors?.length) return null

  return (
    <div>
      <p className="mb-2 text-sm font-medium">
        اللون: <span className="font-normal text-[var(--color-text-muted)]">{selected?.name}</span>
      </p>
      <div className="flex items-center gap-2.5">
        {colors.map((color) => (
          <button
            key={color.hex}
            type="button"
            onClick={() => onSelect(color)}
            aria-label={color.name}
            aria-pressed={selected?.hex === color.hex}
            className="rounded-full p-0.5 transition-shadow"
            style={{
              boxShadow: selected?.hex === color.hex ? `0 0 0 2px var(--color-bg), 0 0 0 3.5px ${color.hex}` : 'none',
            }}
          >
            <span className="block size-7 rounded-full ring-1 ring-[var(--color-text)]/10" style={{ backgroundColor: color.hex }} />
          </button>
        ))}
      </div>
    </div>
  )
}
