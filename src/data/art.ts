// Tu gabinete de piezas. Sube las imágenes a /public/arte/ y añade una entrada.
// - kind: 'tattoo' | 'drawing' | 'flash'
// - size: cómo de grande es el hueco en el gabinete ('s' | 'm' | 'l' | 'tall' | 'wide')
// Las entradas sin `src` muestran un grabado de muestra hasta que pongas tu imagen.

export type ArtKind = 'tattoo' | 'drawing' | 'flash';
export type Slot = 's' | 'm' | 'l' | 'tall' | 'wide';
export type Placeholder =
  | 'moth' | 'pepper' | 'deathshead' | 'key' | 'candle' | 'candelabrum' | 'mirror' | 'eye' | 'tarot' | 'inkwell' | 'dagger'
  | 'ball' | 'poison' | 'bat' | 'batface' | 'skeleton' | 'elvira';

export interface ArtPiece {
  title: string;
  kind: ArtKind;
  year?: string;
  note?: string;
  src?: string;
  size: Slot;
  placeholder?: Placeholder;
}

export const art: ArtPiece[] = [
  { title: "Death's-head Moth", kind: 'flash', year: '2026', size: 'wide', placeholder: 'moth', note: 'Available flash. Chest or back.' },
  { title: 'Patron Saint', kind: 'drawing', year: '2026', size: 'tall', placeholder: 'elvira', note: 'Elvira, Mistress of the Dark.' },
  { title: 'Memento Mori', kind: 'drawing', year: '2026', size: 'tall', placeholder: 'skeleton' },
  { title: 'Crystal Ball', kind: 'tattoo', year: '2026', size: 'tall', placeholder: 'ball' },
  { title: 'Night Visitor', kind: 'flash', year: '2026', size: 'wide', placeholder: 'bat' },
  { title: 'Poison', kind: 'flash', year: '2026', size: 'tall', placeholder: 'poison' },
  { title: "Lover's Eye", kind: 'drawing', year: '2026', size: 'm', placeholder: 'eye' },
  { title: 'Peppered Moth', kind: 'drawing', year: '2026', size: 'm', placeholder: 'pepper' },
  { title: 'The Star', kind: 'drawing', year: '2026', size: 'tall', placeholder: 'tarot' },
  { title: 'Left-Hand Dagger', kind: 'flash', year: '2026', size: 'tall', placeholder: 'dagger' },
  { title: 'Nosferatu', kind: 'tattoo', year: '2026', size: 'm', placeholder: 'batface' },
  { title: 'Candelabrum', kind: 'drawing', year: '2025', size: 'tall', placeholder: 'candelabrum' },
  { title: "Death's Head", kind: 'tattoo', year: '2026', size: 'm', placeholder: 'deathshead' },
];
