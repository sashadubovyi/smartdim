import { NOVA_POSHTA_API_KEY, isNpConfigured } from '../config';

// Тонка обгортка над офіційним API Нової Пошти (v2.0). Виклики виконуються
// лише коли користувач друкує у формі замовлення (з debounce у компоненті),
// тому на швидкість завантаження сайту це не впливає.
const NP_URL = 'https://api.novaposhta.ua/v2.0/json/';

async function npCall(
  modelName: string,
  calledMethod: string,
  methodProperties: Record<string, string>,
): Promise<Array<Record<string, string>>> {
  try {
    const res = await fetch(NP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: NOVA_POSHTA_API_KEY, modelName, calledMethod, methodProperties }),
    });
    const data = await res.json();
    return data?.success ? (data.data ?? []) : [];
  } catch {
    // Мережева помилка / CORS — повертаємо порожньо, поле лишається ручним.
    return [];
  }
}

export interface NpCity {
  ref: string;
  name: string;
  area: string;
}

export async function searchCities(query: string): Promise<NpCity[]> {
  if (!isNpConfigured || query.trim().length < 2) return [];
  const rows = await npCall('Address', 'getCities', { FindByString: query.trim(), Limit: '15' });
  return rows.map((c) => ({ ref: c.Ref, name: c.Description, area: c.AreaDescription }));
}

export interface NpWarehouse {
  ref: string;
  description: string;
  number: string;
  postomat: boolean;
}

export async function searchWarehouses(
  cityRef: string,
  query: string,
  onlyPostomat: boolean,
): Promise<NpWarehouse[]> {
  if (!isNpConfigured || !cityRef) return [];
  const rows = await npCall('Address', 'getWarehouses', {
    CityRef: cityRef,
    FindByString: query.trim(),
    Limit: '50',
  });
  return rows
    .map((w) => ({
      ref: w.Ref,
      description: w.Description,
      number: w.Number,
      postomat: w.CategoryOfWarehouse === 'Postomat',
    }))
    .filter((w) => (onlyPostomat ? w.postomat : !w.postomat))
    .slice(0, 20);
}
