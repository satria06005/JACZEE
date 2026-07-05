import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const province = searchParams.get('province');

  // MOCK DATA: Agar aplikasi selalu berjalan mulus tanpa error API Key / Internet untuk demo kuliah.
  if (type === 'province') {
    return NextResponse.json({
      rajaongkir: {
        results: [
          { province_id: "6", province: "DKI Jakarta" },
          { province_id: "9", province: "Jawa Barat" },
          { province_id: "10", province: "Jawa Tengah" },
          { province_id: "11", province: "Jawa Timur" },
          { province_id: "5", province: "DI Yogyakarta" },
        ]
      }
    });
  }

  if (type === 'city') {
    const cityMocks: Record<string, any[]> = {
      "6": [
        { city_id: "151", type: "Kota", city_name: "Jakarta Barat" },
        { city_id: "152", type: "Kota", city_name: "Jakarta Pusat" },
        { city_id: "153", type: "Kota", city_name: "Jakarta Selatan" },
      ],
      "9": [
        { city_id: "22", type: "Kota", city_name: "Bandung" },
        { city_id: "23", type: "Kabupaten", city_name: "Bandung" },
        { city_id: "78", type: "Kota", city_name: "Bogor" },
        { city_id: "115", type: "Kota", city_name: "Depok" },
      ],
      "10": [
        { city_id: "398", type: "Kota", city_name: "Semarang" },
        { city_id: "427", type: "Kota", city_name: "Surakarta (Solo)" },
      ],
      "11": [
        { city_id: "444", type: "Kota", city_name: "Surabaya" },
        { city_id: "255", type: "Kota", city_name: "Malang" },
      ],
      "5": [
        { city_id: "50", type: "Kota", city_name: "Yogyakarta" },
        { city_id: "38", type: "Kabupaten", city_name: "Bantul" },
        { city_id: "39", type: "Kabupaten", city_name: "Sleman" },
      ]
    };

    return NextResponse.json({
      rajaongkir: {
        results: cityMocks[province || "6"] || cityMocks["6"]
      }
    });
  }

  return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
}

export async function POST(request: Request) {
  // MOCK DATA: Mengembalikan harga ongkir dummy yang realistis
  const body = await request.json();
  const { destination, weight, courier } = body;

  const getMockCosts = (courierName: string) => {
    const basePrice = destination === "153" ? 9000 : 15000;
    if (courierName === "jne") {
      return [
        { service: "Ekonomi", description: "JNE OKE", cost: [{ value: basePrice - 2000, etd: "4-5" }] },
        { service: "Reguler", description: "JNE REG", cost: [{ value: basePrice, etd: "2-3" }] },
        { service: "Next Day", description: "JNE YES", cost: [{ value: basePrice + 10000, etd: "1" }] },
        { service: "Kargo", description: "JNE Trucking", cost: [{ value: basePrice - 5000, etd: "5-7" }] }
      ];
    } else if (courierName === "pos") {
      return [
        { service: "Biasa", description: "Pos Reguler", cost: [{ value: basePrice - 3000, etd: "5-7" }] },
        { service: "Kilat", description: "Pos Kilat Khusus", cost: [{ value: basePrice - 1000, etd: "2-4" }] },
        { service: "Express", description: "Pos Express", cost: [{ value: basePrice + 12000, etd: "1" }] }
      ];
    } else {
      return [
        { service: "Hemat", description: "TIKI ECO", cost: [{ value: basePrice - 1000, etd: "4-5" }] },
        { service: "Reguler", description: "TIKI REG", cost: [{ value: basePrice, etd: "2-3" }] },
        { service: "Over Night", description: "TIKI ONS", cost: [{ value: basePrice + 9000, etd: "1" }] }
      ];
    }
  };

  return NextResponse.json({
    rajaongkir: {
      results: [
        {
          code: courier,
          name: courier.toUpperCase(),
          costs: getMockCosts(courier)
        }
      ]
    }
  });
}
