import { Product, Customer, Order, StockBatch, StockMovement, RevenueData, Invoice, DeliveryNote, PurchaseOrder, Return, InventoryCount, PfandTransaction } from './types'

export const product: Product = {
  id: 'prod-001',
  name: 'Cocodo Kokoswasser',
  sku: 'COC-250-001',
  size: '250ml',
  pfand: 0.25,
  b2cPricing: [
    { quantity: 24, price: 55.55, pricePerCan: 2.31 },
    { quantity: 48, price: 105.55, pricePerCan: 2.20 },
    { quantity: 72, price: 155.55, pricePerCan: 2.16 },
    { quantity: 96, price: 205.55, pricePerCan: 2.14 },
  ],
  b2bBasePrice: 1.80,
  origin: 'Mekong Delta, Vietnam',
  description: '100% reines Kokoswasser aus jungen grünen Kokosnüssen. Natürlich isotonisch, vegan, glutenfrei.',
}

export const customers: Customer[] = [
  { id: 'c01', name: 'Kiosk Am Markt', type: 'Kiosk', contact: { person: 'Mehmet Yilmaz', email: 'mehmet@kioskammarkt.de', phone: '+49 30 5551234' }, address: { street: 'Hauptstr. 15', city: 'Berlin', postalCode: '10115' }, pricing: 1.85, lastOrder: '2026-02-05', totalOrders: 24, totalRevenue: 4320, frequency: 'Wöchentlich' },
  { id: 'c02', name: 'REWE Mitte', type: 'Supermarkt', contact: { person: 'Sandra Krüger', email: 's.krueger@rewe.de', phone: '+49 30 5552345' }, address: { street: 'Friedrichstr. 120', city: 'Berlin', postalCode: '10117' }, pricing: 1.72, lastOrder: '2026-02-06', totalOrders: 36, totalRevenue: 8200, frequency: 'Wöchentlich' },
  { id: 'c03', name: 'Café Bohne', type: 'Café', contact: { person: 'Lisa Hartmann', email: 'lisa@cafebohne.de', phone: '+49 89 5553456' }, address: { street: 'Leopoldstr. 42', city: 'München', postalCode: '80802' }, pricing: 1.95, lastOrder: '2026-02-03', totalOrders: 18, totalRevenue: 3240, frequency: '2x Monat' },
  { id: 'c04', name: 'Spätkauf Kreuzberg', type: 'Kiosk', contact: { person: 'Ali Özdemir', email: 'ali@spaetkauf-xberg.de', phone: '+49 30 5554567' }, address: { street: 'Oranienstr. 88', city: 'Berlin', postalCode: '10999' }, pricing: 1.85, lastOrder: '2026-02-07', totalOrders: 28, totalRevenue: 5040, frequency: 'Wöchentlich' },
  { id: 'c05', name: 'Bio-Supermarkt Grün', type: 'Supermarkt', contact: { person: 'Jan Petersen', email: 'jan@biogruen.de', phone: '+49 40 5555678' }, address: { street: 'Eppendorfer Weg 55', city: 'Hamburg', postalCode: '20259' }, pricing: 1.75, lastOrder: '2026-02-04', totalOrders: 22, totalRevenue: 6800, frequency: '2x Monat' },
  { id: 'c06', name: 'PowerGym Fitness', type: 'Café', contact: { person: 'Max Stark', email: 'max@powergym.de', phone: '+49 221 5556789' }, address: { street: 'Ehrenstr. 33', city: 'Köln', postalCode: '50672' }, pricing: 1.90, lastOrder: '2026-01-30', totalOrders: 15, totalRevenue: 2850, frequency: '2x Monat' },
  { id: 'c07', name: 'Yoga Zentrum Namaste', type: 'Café', contact: { person: 'Sarah Weber', email: 'sarah@yoganamaste.de', phone: '+49 69 5557890' }, address: { street: 'Berger Str. 72', city: 'Frankfurt', postalCode: '60316' }, pricing: 1.95, lastOrder: '2026-01-28', totalOrders: 12, totalRevenue: 2160, frequency: 'Monatlich' },
  { id: 'c08', name: 'Café Sunset', type: 'Café', contact: { person: 'Nina Braun', email: 'nina@cafesunset.de', phone: '+49 711 5558901' }, address: { street: 'Königstr. 60', city: 'Stuttgart', postalCode: '70173' }, pricing: 1.95, lastOrder: '2026-02-01', totalOrders: 10, totalRevenue: 1800, frequency: 'Monatlich' },
  { id: 'c09', name: 'EDEKA Stadtmitte', type: 'Supermarkt', contact: { person: 'Thomas Bauer', email: 'bauer@edeka-stadtmitte.de', phone: '+49 211 5559012' }, address: { street: 'Schadowstr. 28', city: 'Düsseldorf', postalCode: '40212' }, pricing: 1.72, lastOrder: '2026-02-06', totalOrders: 30, totalRevenue: 7200, frequency: 'Wöchentlich' },
  { id: 'c10', name: 'Tankstelle Esso Messe', type: 'Kiosk', contact: { person: 'Peter Schneider', email: 'p.schneider@esso.de', phone: '+49 341 5550123' }, address: { street: 'Messeallee 5', city: 'Leipzig', postalCode: '04103' }, pricing: 1.90, lastOrder: '2026-01-25', totalOrders: 8, totalRevenue: 1440, frequency: 'Monatlich' },
  { id: 'c11', name: 'Kiosk Hauptbahnhof', type: 'Kiosk', contact: { person: 'Claudia Engel', email: 'claudia@kiosk-hbf.de', phone: '+49 40 5551230' }, address: { street: 'Hachmannplatz 1', city: 'Hamburg', postalCode: '20099' }, pricing: 1.85, lastOrder: '2026-02-07', totalOrders: 32, totalRevenue: 5760, frequency: 'Wöchentlich' },
  { id: 'c12', name: 'Reformhaus Natura', type: 'Supermarkt', contact: { person: 'Monika Grün', email: 'monika@reformhaus-natura.de', phone: '+49 911 5552340' }, address: { street: 'Karolinenstr. 15', city: 'Nürnberg', postalCode: '90402' }, pricing: 1.78, lastOrder: '2026-02-02', totalOrders: 14, totalRevenue: 3360, frequency: '2x Monat' },
  { id: 'c13', name: 'FreshDirect Großhandel', type: 'Großhandel', contact: { person: 'Klaus Fischer', email: 'fischer@freshdirect.de', phone: '+49 421 5553450' }, address: { street: 'Überseestadt 20', city: 'Bremen', postalCode: '28217' }, pricing: 1.65, lastOrder: '2026-02-06', totalOrders: 8, totalRevenue: 9500, frequency: 'Monatlich' },
  { id: 'c14', name: 'Café Latte Art', type: 'Café', contact: { person: 'Julia Müller', email: 'julia@latteart.de', phone: '+49 511 5554560' }, address: { street: 'Lister Meile 30', city: 'Hannover', postalCode: '30161' }, pricing: 1.95, lastOrder: '2026-01-20', totalOrders: 6, totalRevenue: 1080, frequency: 'Unregelmäßig' },
  { id: 'c15', name: 'Campus Kiosk', type: 'Kiosk', contact: { person: 'David Kim', email: 'david@campuskiosk.de', phone: '+49 6221 5555670' }, address: { street: 'Bergheimer Str. 58', city: 'Heidelberg', postalCode: '69115' }, pricing: 1.85, lastOrder: '2026-02-04', totalOrders: 16, totalRevenue: 2880, frequency: '2x Monat' },
]

export const orders: Order[] = [
  { id: 'o01', orderNumber: 'CO-2026-156', customerId: 'c02', customerName: 'REWE Mitte', type: 'B2B', status: 'Neu', quantity: 240, pricePerCan: 1.72, subtotal: 412.80, pfandTotal: 60.00, total: 472.80, createdAt: '2026-02-08' },
  { id: 'o02', orderNumber: 'CO-2026-155', customerId: 'c04', customerName: 'Spätkauf Kreuzberg', type: 'B2B', status: 'Neu', quantity: 96, pricePerCan: 1.85, subtotal: 177.60, pfandTotal: 24.00, total: 201.60, createdAt: '2026-02-08' },
  { id: 'o03', orderNumber: 'CO-2026-154', customerName: 'Online-Bestellung #4821', type: 'B2C', status: 'In Bearbeitung', quantity: 48, pricePerCan: 2.20, subtotal: 105.55, pfandTotal: 12.00, total: 117.55, createdAt: '2026-02-07' },
  { id: 'o04', orderNumber: 'CO-2026-153', customerId: 'c11', customerName: 'Kiosk Hauptbahnhof', type: 'B2B', status: 'In Bearbeitung', quantity: 144, pricePerCan: 1.85, subtotal: 266.40, pfandTotal: 36.00, total: 302.40, createdAt: '2026-02-07' },
  { id: 'o05', orderNumber: 'CO-2026-152', customerName: 'Online-Bestellung #4820', type: 'B2C', status: 'Versendet', quantity: 24, pricePerCan: 2.31, subtotal: 55.55, pfandTotal: 6.00, total: 61.55, createdAt: '2026-02-06', shippedAt: '2026-02-07' },
  { id: 'o06', orderNumber: 'CO-2026-151', customerId: 'c13', customerName: 'FreshDirect Großhandel', type: 'B2B', status: 'Versendet', quantity: 480, pricePerCan: 1.65, subtotal: 792.00, pfandTotal: 120.00, total: 912.00, createdAt: '2026-02-06', shippedAt: '2026-02-07' },
  { id: 'o07', orderNumber: 'CO-2026-150', customerId: 'c09', customerName: 'EDEKA Stadtmitte', type: 'B2B', status: 'Versendet', quantity: 192, pricePerCan: 1.72, subtotal: 330.24, pfandTotal: 48.00, total: 378.24, createdAt: '2026-02-05', shippedAt: '2026-02-06' },
  { id: 'o08', orderNumber: 'CO-2026-149', customerName: 'Online-Bestellung #4819', type: 'B2C', status: 'Geliefert', quantity: 96, pricePerCan: 2.14, subtotal: 205.55, pfandTotal: 24.00, total: 229.55, createdAt: '2026-02-05', shippedAt: '2026-02-05', deliveredAt: '2026-02-07' },
  { id: 'o09', orderNumber: 'CO-2026-148', customerId: 'c01', customerName: 'Kiosk Am Markt', type: 'B2B', status: 'Geliefert', quantity: 96, pricePerCan: 1.85, subtotal: 177.60, pfandTotal: 24.00, total: 201.60, createdAt: '2026-02-05', shippedAt: '2026-02-05', deliveredAt: '2026-02-06' },
  { id: 'o10', orderNumber: 'CO-2026-147', customerId: 'c05', customerName: 'Bio-Supermarkt Grün', type: 'B2B', status: 'Geliefert', quantity: 168, pricePerCan: 1.75, subtotal: 294.00, pfandTotal: 42.00, total: 336.00, createdAt: '2026-02-04', shippedAt: '2026-02-04', deliveredAt: '2026-02-06' },
  { id: 'o11', orderNumber: 'CO-2026-146', customerName: 'Online-Bestellung #4818', type: 'B2C', status: 'Geliefert', quantity: 72, pricePerCan: 2.16, subtotal: 155.55, pfandTotal: 18.00, total: 173.55, createdAt: '2026-02-04', shippedAt: '2026-02-04', deliveredAt: '2026-02-06' },
  { id: 'o12', orderNumber: 'CO-2026-145', customerId: 'c03', customerName: 'Café Bohne', type: 'B2B', status: 'Geliefert', quantity: 48, pricePerCan: 1.95, subtotal: 93.60, pfandTotal: 12.00, total: 105.60, createdAt: '2026-02-03', shippedAt: '2026-02-03', deliveredAt: '2026-02-05' },
  { id: 'o13', orderNumber: 'CO-2026-144', customerName: 'Online-Bestellung #4817', type: 'B2C', status: 'Geliefert', quantity: 24, pricePerCan: 2.31, subtotal: 55.55, pfandTotal: 6.00, total: 61.55, createdAt: '2026-02-03', shippedAt: '2026-02-03', deliveredAt: '2026-02-05' },
  { id: 'o14', orderNumber: 'CO-2026-143', customerId: 'c15', customerName: 'Campus Kiosk', type: 'B2B', status: 'Geliefert', quantity: 72, pricePerCan: 1.85, subtotal: 133.20, pfandTotal: 18.00, total: 151.20, createdAt: '2026-02-02', shippedAt: '2026-02-02', deliveredAt: '2026-02-04' },
  { id: 'o15', orderNumber: 'CO-2026-142', customerId: 'c12', customerName: 'Reformhaus Natura', type: 'B2B', status: 'Geliefert', quantity: 120, pricePerCan: 1.78, subtotal: 213.60, pfandTotal: 30.00, total: 243.60, createdAt: '2026-02-02', shippedAt: '2026-02-02', deliveredAt: '2026-02-04' },
  { id: 'o16', orderNumber: 'CO-2026-141', customerName: 'Online-Bestellung #4816', type: 'B2C', status: 'Geliefert', quantity: 48, pricePerCan: 2.20, subtotal: 105.55, pfandTotal: 12.00, total: 117.55, createdAt: '2026-02-01', shippedAt: '2026-02-01', deliveredAt: '2026-02-03' },
  { id: 'o17', orderNumber: 'CO-2026-140', customerId: 'c08', customerName: 'Café Sunset', type: 'B2B', status: 'Geliefert', quantity: 48, pricePerCan: 1.95, subtotal: 93.60, pfandTotal: 12.00, total: 105.60, createdAt: '2026-02-01', shippedAt: '2026-02-01', deliveredAt: '2026-02-03' },
  { id: 'o18', orderNumber: 'CO-2026-139', customerId: 'c02', customerName: 'REWE Mitte', type: 'B2B', status: 'Geliefert', quantity: 240, pricePerCan: 1.72, subtotal: 412.80, pfandTotal: 60.00, total: 472.80, createdAt: '2026-01-31', shippedAt: '2026-01-31', deliveredAt: '2026-02-02' },
  { id: 'o19', orderNumber: 'CO-2026-138', customerName: 'Online-Bestellung #4815', type: 'B2C', status: 'Geliefert', quantity: 24, pricePerCan: 2.31, subtotal: 55.55, pfandTotal: 6.00, total: 61.55, createdAt: '2026-01-30', shippedAt: '2026-01-30', deliveredAt: '2026-02-01' },
  { id: 'o20', orderNumber: 'CO-2026-137', customerId: 'c06', customerName: 'PowerGym Fitness', type: 'B2B', status: 'Geliefert', quantity: 72, pricePerCan: 1.90, subtotal: 136.80, pfandTotal: 18.00, total: 154.80, createdAt: '2026-01-30', shippedAt: '2026-01-30', deliveredAt: '2026-02-01' },
  { id: 'o21', orderNumber: 'CO-2026-136', customerId: 'c04', customerName: 'Spätkauf Kreuzberg', type: 'B2B', status: 'Geliefert', quantity: 96, pricePerCan: 1.85, subtotal: 177.60, pfandTotal: 24.00, total: 201.60, createdAt: '2026-01-29', shippedAt: '2026-01-29', deliveredAt: '2026-01-31' },
  { id: 'o22', orderNumber: 'CO-2026-135', customerName: 'Online-Bestellung #4814', type: 'B2C', status: 'Geliefert', quantity: 48, pricePerCan: 2.20, subtotal: 105.55, pfandTotal: 12.00, total: 117.55, createdAt: '2026-01-28', shippedAt: '2026-01-28', deliveredAt: '2026-01-30' },
  { id: 'o23', orderNumber: 'CO-2026-134', customerId: 'c09', customerName: 'EDEKA Stadtmitte', type: 'B2B', status: 'Geliefert', quantity: 192, pricePerCan: 1.72, subtotal: 330.24, pfandTotal: 48.00, total: 378.24, createdAt: '2026-01-27', shippedAt: '2026-01-27', deliveredAt: '2026-01-29' },
  { id: 'o24', orderNumber: 'CO-2026-133', customerId: 'c11', customerName: 'Kiosk Hauptbahnhof', type: 'B2B', status: 'Geliefert', quantity: 144, pricePerCan: 1.85, subtotal: 266.40, pfandTotal: 36.00, total: 302.40, createdAt: '2026-01-26', shippedAt: '2026-01-26', deliveredAt: '2026-01-28' },
  { id: 'o25', orderNumber: 'CO-2026-132', customerName: 'Online-Bestellung #4813', type: 'B2C', status: 'Geliefert', quantity: 96, pricePerCan: 2.14, subtotal: 205.55, pfandTotal: 24.00, total: 229.55, createdAt: '2026-01-25', shippedAt: '2026-01-25', deliveredAt: '2026-01-27' },
  { id: 'o26', orderNumber: 'CO-2026-131', customerId: 'c01', customerName: 'Kiosk Am Markt', type: 'B2B', status: 'Geliefert', quantity: 96, pricePerCan: 1.85, subtotal: 177.60, pfandTotal: 24.00, total: 201.60, createdAt: '2026-01-24', shippedAt: '2026-01-24', deliveredAt: '2026-01-26' },
  { id: 'o27', orderNumber: 'CO-2026-130', customerId: 'c07', customerName: 'Yoga Zentrum Namaste', type: 'B2B', status: 'Geliefert', quantity: 48, pricePerCan: 1.95, subtotal: 93.60, pfandTotal: 12.00, total: 105.60, createdAt: '2026-01-22', shippedAt: '2026-01-22', deliveredAt: '2026-01-24' },
  { id: 'o28', orderNumber: 'CO-2026-129', customerName: 'Online-Bestellung #4812', type: 'B2C', status: 'Geliefert', quantity: 24, pricePerCan: 2.31, subtotal: 55.55, pfandTotal: 6.00, total: 61.55, createdAt: '2026-01-20', shippedAt: '2026-01-20', deliveredAt: '2026-01-22' },
  { id: 'o29', orderNumber: 'CO-2026-128', customerId: 'c13', customerName: 'FreshDirect Großhandel', type: 'B2B', status: 'Geliefert', quantity: 480, pricePerCan: 1.65, subtotal: 792.00, pfandTotal: 120.00, total: 912.00, createdAt: '2026-01-18', shippedAt: '2026-01-18', deliveredAt: '2026-01-20' },
  { id: 'o30', orderNumber: 'CO-2026-127', customerId: 'c05', customerName: 'Bio-Supermarkt Grün', type: 'B2B', status: 'Storniert', quantity: 168, pricePerCan: 1.75, subtotal: 294.00, pfandTotal: 42.00, total: 336.00, createdAt: '2026-01-15' },
]

export const stockBatches: StockBatch[] = [
  { id: 'b01', batchNumber: 'VN-2025-08', quantity: 3500, location: 'Lager A1-B3', mhd: '2026-08-15', receivedAt: '2025-12-10', origin: 'Mekong Delta, Vietnam', status: 'Aktiv' },
  { id: 'b02', batchNumber: 'VN-2025-10', quantity: 3000, location: 'Lager A2-C1', mhd: '2026-06-20', receivedAt: '2026-01-15', origin: 'Mekong Delta, Vietnam', status: 'Aktiv' },
  { id: 'b03', batchNumber: 'VN-2025-06', quantity: 1500, location: 'Lager B1-A2', mhd: '2026-03-10', receivedAt: '2025-10-05', origin: 'Mekong Delta, Vietnam', status: 'Kritisch' },
]

export const stockMovements: StockMovement[] = [
  { id: 'm01', type: 'Warenausgang', quantity: 240, batchNumber: 'VN-2025-10', reason: 'Bestellung CO-2026-156 (REWE Mitte)', createdAt: '2026-02-08' },
  { id: 'm02', type: 'Warenausgang', quantity: 96, batchNumber: 'VN-2025-08', reason: 'Bestellung CO-2026-155 (Spätkauf Kreuzberg)', createdAt: '2026-02-08' },
  { id: 'm03', type: 'Warenausgang', quantity: 48, batchNumber: 'VN-2025-08', reason: 'Bestellung CO-2026-154 (Online #4821)', createdAt: '2026-02-07' },
  { id: 'm04', type: 'Warenausgang', quantity: 144, batchNumber: 'VN-2025-10', reason: 'Bestellung CO-2026-153 (Kiosk Hauptbahnhof)', createdAt: '2026-02-07' },
  { id: 'm05', type: 'Warenausgang', quantity: 24, batchNumber: 'VN-2025-06', reason: 'Bestellung CO-2026-152 (Online #4820)', createdAt: '2026-02-06' },
  { id: 'm06', type: 'Warenausgang', quantity: 480, batchNumber: 'VN-2025-10', reason: 'Bestellung CO-2026-151 (FreshDirect)', createdAt: '2026-02-06' },
  { id: 'm07', type: 'Warenausgang', quantity: 192, batchNumber: 'VN-2025-08', reason: 'Bestellung CO-2026-150 (EDEKA Stadtmitte)', createdAt: '2026-02-05' },
  { id: 'm08', type: 'Warenausgang', quantity: 96, batchNumber: 'VN-2025-08', reason: 'Bestellung CO-2026-149 (Online #4819)', createdAt: '2026-02-05' },
  { id: 'm09', type: 'Wareneingang', quantity: 3000, batchNumber: 'VN-2025-10', reason: 'Container-Lieferung aus Vietnam', createdAt: '2026-01-15' },
  { id: 'm10', type: 'Korrektur', quantity: -24, batchNumber: 'VN-2025-06', reason: 'Bruch bei Kommissionierung', createdAt: '2026-01-12' },
  { id: 'm11', type: 'Warenausgang', quantity: 240, batchNumber: 'VN-2025-08', reason: 'Bestellung CO-2026-139 (REWE Mitte)', createdAt: '2026-01-31' },
  { id: 'm12', type: 'Warenausgang', quantity: 144, batchNumber: 'VN-2025-08', reason: 'Bestellung CO-2026-138 (Kiosk HBF)', createdAt: '2026-01-26' },
  { id: 'm13', type: 'Wareneingang', quantity: 3500, batchNumber: 'VN-2025-08', reason: 'Container-Lieferung aus Vietnam', createdAt: '2025-12-10' },
]

export const revenueData: RevenueData[] = [
  { month: '2025-09', label: 'Sep', b2b: 8000, b2c: 4500, total: 12500 },
  { month: '2025-10', label: 'Okt', b2b: 9800, b2c: 5400, total: 15200 },
  { month: '2025-11', label: 'Nov', b2b: 12100, b2c: 6500, total: 18600 },
  { month: '2025-12', label: 'Dez', b2b: 14900, b2c: 7900, total: 22800 },
  { month: '2026-01', label: 'Jan', b2b: 17200, b2c: 9200, total: 26400 },
  { month: '2026-02', label: 'Feb', b2b: 20400, b2c: 10800, total: 31200 },
]

// Invoices — generated from delivered orders
export const invoices: Invoice[] = [
  { id: 'inv01', invoiceNumber: 'RE-2026-048', orderId: 'o09', orderNumber: 'CO-2026-148', customerId: 'c01', customerName: 'Kiosk Am Markt', type: 'B2B', subtotal: 177.60, pfandTotal: 24.00, total: 201.60, status: 'Bezahlt', dueDate: '2026-02-20', paidAt: '2026-02-08', createdAt: '2026-02-06', paymentTerms: '14 Tage netto' },
  { id: 'inv02', invoiceNumber: 'RE-2026-047', orderId: 'o10', orderNumber: 'CO-2026-147', customerId: 'c05', customerName: 'Bio-Supermarkt Grün', type: 'B2B', subtotal: 294.00, pfandTotal: 42.00, total: 336.00, status: 'Offen', dueDate: '2026-03-06', createdAt: '2026-02-06', paymentTerms: '30 Tage netto' },
  { id: 'inv03', invoiceNumber: 'RE-2026-046', orderId: 'o12', orderNumber: 'CO-2026-145', customerId: 'c03', customerName: 'Café Bohne', type: 'B2B', subtotal: 93.60, pfandTotal: 12.00, total: 105.60, status: 'Offen', dueDate: '2026-02-19', createdAt: '2026-02-05', paymentTerms: '14 Tage netto' },
  { id: 'inv04', invoiceNumber: 'RE-2026-045', orderId: 'o14', orderNumber: 'CO-2026-143', customerId: 'c15', customerName: 'Campus Kiosk', type: 'B2B', subtotal: 133.20, pfandTotal: 18.00, total: 151.20, status: 'Bezahlt', dueDate: '2026-02-16', paidAt: '2026-02-07', createdAt: '2026-02-04', paymentTerms: '14 Tage netto' },
  { id: 'inv05', invoiceNumber: 'RE-2026-044', orderId: 'o15', orderNumber: 'CO-2026-142', customerId: 'c12', customerName: 'Reformhaus Natura', type: 'B2B', subtotal: 213.60, pfandTotal: 30.00, total: 243.60, status: 'Offen', dueDate: '2026-03-04', createdAt: '2026-02-04', paymentTerms: '30 Tage netto' },
  { id: 'inv06', invoiceNumber: 'RE-2026-043', orderId: 'o17', orderNumber: 'CO-2026-140', customerId: 'c08', customerName: 'Café Sunset', type: 'B2B', subtotal: 93.60, pfandTotal: 12.00, total: 105.60, status: 'Bezahlt', dueDate: '2026-02-15', paidAt: '2026-02-05', createdAt: '2026-02-03', paymentTerms: '14 Tage netto' },
  { id: 'inv07', invoiceNumber: 'RE-2026-042', orderId: 'o18', orderNumber: 'CO-2026-139', customerId: 'c02', customerName: 'REWE Mitte', type: 'B2B', subtotal: 412.80, pfandTotal: 60.00, total: 472.80, status: 'Bezahlt', dueDate: '2026-03-02', paidAt: '2026-02-06', createdAt: '2026-02-02', paymentTerms: '30 Tage netto' },
  { id: 'inv08', invoiceNumber: 'RE-2026-041', orderId: 'o20', orderNumber: 'CO-2026-137', customerId: 'c06', customerName: 'PowerGym Fitness', type: 'B2B', subtotal: 136.80, pfandTotal: 18.00, total: 154.80, status: 'Überfällig', dueDate: '2026-02-06', createdAt: '2026-01-30', paymentTerms: '7 Tage netto' },
  { id: 'inv09', invoiceNumber: 'RE-2026-040', orderId: 'o21', orderNumber: 'CO-2026-136', customerId: 'c04', customerName: 'Spätkauf Kreuzberg', type: 'B2B', subtotal: 177.60, pfandTotal: 24.00, total: 201.60, status: 'Bezahlt', dueDate: '2026-02-12', paidAt: '2026-02-03', createdAt: '2026-01-31', paymentTerms: '14 Tage netto' },
  { id: 'inv10', invoiceNumber: 'RE-2026-039', orderId: 'o29', orderNumber: 'CO-2026-128', customerId: 'c13', customerName: 'FreshDirect Großhandel', type: 'B2B', subtotal: 792.00, pfandTotal: 120.00, total: 912.00, status: 'Bezahlt', dueDate: '2026-02-17', paidAt: '2026-02-04', createdAt: '2026-01-20', paymentTerms: '30 Tage netto' },
]

// Delivery Notes
export const deliveryNotes: DeliveryNote[] = [
  { id: 'dn01', deliveryNumber: 'LS-2026-089', orderId: 'o05', orderNumber: 'CO-2026-152', customerName: 'Online-Bestellung #4820', address: 'Kundenadresse, Berlin', quantity: 24, status: 'In Zustellung', carrier: 'DHL', trackingNumber: 'JJD000390012345678', createdAt: '2026-02-07' },
  { id: 'dn02', deliveryNumber: 'LS-2026-088', orderId: 'o06', orderNumber: 'CO-2026-151', customerName: 'FreshDirect Großhandel', address: 'Überseestadt 20, 28217 Bremen', quantity: 480, status: 'In Zustellung', carrier: 'DPD', trackingNumber: '01234567890123', createdAt: '2026-02-07' },
  { id: 'dn03', deliveryNumber: 'LS-2026-087', orderId: 'o07', orderNumber: 'CO-2026-150', customerName: 'EDEKA Stadtmitte', address: 'Schadowstr. 28, 40212 Düsseldorf', quantity: 192, status: 'In Zustellung', carrier: 'DHL', trackingNumber: 'JJD000390012345679', createdAt: '2026-02-06' },
  { id: 'dn04', deliveryNumber: 'LS-2026-086', orderId: 'o08', orderNumber: 'CO-2026-149', customerName: 'Online-Bestellung #4819', address: 'Kundenadresse, München', quantity: 96, status: 'Zugestellt', carrier: 'DHL', trackingNumber: 'JJD000390012345680', createdAt: '2026-02-05', deliveredAt: '2026-02-07' },
  { id: 'dn05', deliveryNumber: 'LS-2026-085', orderId: 'o09', orderNumber: 'CO-2026-148', customerName: 'Kiosk Am Markt', address: 'Hauptstr. 15, 10115 Berlin', quantity: 96, status: 'Zugestellt', carrier: 'Eigenlieferung', createdAt: '2026-02-05', deliveredAt: '2026-02-06' },
  { id: 'dn06', deliveryNumber: 'LS-2026-084', orderId: 'o10', orderNumber: 'CO-2026-147', customerName: 'Bio-Supermarkt Grün', address: 'Eppendorfer Weg 55, 20259 Hamburg', quantity: 168, status: 'Zugestellt', carrier: 'DPD', trackingNumber: '01234567890124', createdAt: '2026-02-04', deliveredAt: '2026-02-06' },
  { id: 'dn07', deliveryNumber: 'LS-2026-083', orderId: 'o12', orderNumber: 'CO-2026-145', customerName: 'Café Bohne', address: 'Leopoldstr. 42, 80802 München', quantity: 48, status: 'Zugestellt', carrier: 'DHL', trackingNumber: 'JJD000390012345681', createdAt: '2026-02-03', deliveredAt: '2026-02-05' },
]

// Purchase Orders — from Vietnam supplier
export const purchaseOrders: PurchaseOrder[] = [
  { id: 'po01', poNumber: 'PO-2026-003', supplier: 'Mekong Delta Coconut Co.', quantity: 5000, pricePerUnit: 0.85, shippingCost: 1200, customsCost: 380, totalCost: 5830, status: 'Verschifft', orderDate: '2026-01-20', estimatedArrival: '2026-03-05', containerNumber: 'MSKU7294610', notes: 'Container ab Ho-Chi-Minh-Stadt, ETA Hamburg' },
  { id: 'po02', poNumber: 'PO-2026-002', supplier: 'Mekong Delta Coconut Co.', quantity: 3000, pricePerUnit: 0.85, shippingCost: 980, customsCost: 280, totalCost: 3810, status: 'Geliefert', orderDate: '2025-12-01', estimatedArrival: '2026-01-15', actualArrival: '2026-01-15', containerNumber: 'MSKU6183502', notes: 'Charge VN-2025-10 — erfolgreich eingelagert' },
  { id: 'po03', poNumber: 'PO-2026-001', supplier: 'Mekong Delta Coconut Co.', quantity: 3500, pricePerUnit: 0.82, shippingCost: 1050, customsCost: 320, totalCost: 4240, status: 'Geliefert', orderDate: '2025-10-15', estimatedArrival: '2025-12-10', actualArrival: '2025-12-10', containerNumber: 'MSKU5072491', notes: 'Charge VN-2025-08 — erfolgreich eingelagert' },
]

// Returns
export const returns: Return[] = [
  { id: 'ret01', returnNumber: 'RET-2026-005', orderId: 'o08', orderNumber: 'CO-2026-149', customerName: 'Online-Bestellung #4819', reason: 'Beschädigt', quantity: 6, resolution: 'Ersatzlieferung', status: 'Abgeschlossen', amount: 12.84, createdAt: '2026-02-07', resolvedAt: '2026-02-08', notes: '6 Dosen beschädigt bei Transport' },
  { id: 'ret02', returnNumber: 'RET-2026-004', orderNumber: 'CO-2026-145', customerName: 'Café Bohne', reason: 'Fehllieferung', quantity: 12, resolution: 'Gutschrift', status: 'Abgeschlossen', amount: 23.40, createdAt: '2026-02-05', resolvedAt: '2026-02-06', notes: 'Falsche Menge geliefert (60 statt 48)' },
  { id: 'ret03', returnNumber: 'RET-2026-003', customerName: 'Online-Bestellung #4815', reason: 'Kundenwunsch', quantity: 24, resolution: 'Gutschrift', status: 'In Bearbeitung', amount: 55.44, createdAt: '2026-02-02', notes: 'Kunde möchte komplett stornieren' },
  { id: 'ret04', returnNumber: 'RET-2026-002', customerName: 'Tankstelle Esso Messe', reason: 'MHD abgelaufen', quantity: 18, resolution: 'Ersatzlieferung', status: 'Offen', amount: 34.20, createdAt: '2026-01-28', notes: 'MHD-Ware Charge VN-2025-06' },
  { id: 'ret05', returnNumber: 'RET-2026-001', customerName: 'Kiosk Hauptbahnhof', reason: 'Beschädigt', quantity: 4, resolution: 'Gutschrift', status: 'Abgeschlossen', amount: 7.40, createdAt: '2026-01-22', resolvedAt: '2026-01-24', notes: '4 Dosen undicht' },
]

// Inventory Counts
export const inventoryCounts: InventoryCount[] = [
  { id: 'ic01', batchNumber: 'VN-2025-08', location: 'Lager A1-B3', systemQuantity: 3500, countedQuantity: 3488, difference: -12, status: 'Korrigiert', countedAt: '2026-02-01', countedBy: 'M. Yilmaz', notes: 'Bruch + Schwund korrigiert' },
  { id: 'ic02', batchNumber: 'VN-2025-10', location: 'Lager A2-C1', systemQuantity: 3000, countedQuantity: 3000, difference: 0, status: 'Gezählt', countedAt: '2026-02-01', countedBy: 'M. Yilmaz', notes: 'Bestand korrekt' },
  { id: 'ic03', batchNumber: 'VN-2025-06', location: 'Lager B1-A2', systemQuantity: 1500, countedQuantity: 1494, difference: -6, status: 'Korrigiert', countedAt: '2026-02-01', countedBy: 'S. Krüger', notes: '6 Dosen beschädigt entsorgt' },
]

// Pfand Transactions
export const pfandTransactions: PfandTransaction[] = [
  { id: 'pf01', customerId: 'c02', customerName: 'REWE Mitte', type: 'Ausgabe', quantity: 240, amount: 60.00, orderId: 'o01', orderNumber: 'CO-2026-156', createdAt: '2026-02-08' },
  { id: 'pf02', customerId: 'c04', customerName: 'Spätkauf Kreuzberg', type: 'Ausgabe', quantity: 96, amount: 24.00, orderId: 'o02', orderNumber: 'CO-2026-155', createdAt: '2026-02-08' },
  { id: 'pf03', customerId: 'c02', customerName: 'REWE Mitte', type: 'Rücknahme', quantity: 200, amount: 50.00, createdAt: '2026-02-07' },
  { id: 'pf04', customerId: 'c11', customerName: 'Kiosk Hauptbahnhof', type: 'Ausgabe', quantity: 144, amount: 36.00, orderId: 'o04', orderNumber: 'CO-2026-153', createdAt: '2026-02-07' },
  { id: 'pf05', customerId: 'c13', customerName: 'FreshDirect Großhandel', type: 'Ausgabe', quantity: 480, amount: 120.00, orderId: 'o06', orderNumber: 'CO-2026-151', createdAt: '2026-02-06' },
  { id: 'pf06', customerId: 'c09', customerName: 'EDEKA Stadtmitte', type: 'Ausgabe', quantity: 192, amount: 48.00, orderId: 'o07', orderNumber: 'CO-2026-150', createdAt: '2026-02-05' },
  { id: 'pf07', customerId: 'c01', customerName: 'Kiosk Am Markt', type: 'Ausgabe', quantity: 96, amount: 24.00, orderId: 'o09', orderNumber: 'CO-2026-148', createdAt: '2026-02-05' },
  { id: 'pf08', customerId: 'c01', customerName: 'Kiosk Am Markt', type: 'Rücknahme', quantity: 80, amount: 20.00, createdAt: '2026-02-05' },
  { id: 'pf09', customerId: 'c04', customerName: 'Spätkauf Kreuzberg', type: 'Rücknahme', quantity: 96, amount: 24.00, createdAt: '2026-02-04' },
  { id: 'pf10', customerId: 'c09', customerName: 'EDEKA Stadtmitte', type: 'Rücknahme', quantity: 150, amount: 37.50, createdAt: '2026-02-03' },
  { id: 'pf11', customerId: 'c11', customerName: 'Kiosk Hauptbahnhof', type: 'Rücknahme', quantity: 120, amount: 30.00, createdAt: '2026-02-02' },
  { id: 'pf12', customerId: 'c13', customerName: 'FreshDirect Großhandel', type: 'Rücknahme', quantity: 400, amount: 100.00, createdAt: '2026-01-25' },
]

// Aggregated stats
export const totalStock = stockBatches.reduce((sum, b) => sum + b.quantity, 0)
export const stockCapacity = 10000
export const openOrders = orders.filter(o => o.status === 'Neu' || o.status === 'In Bearbeitung').length
export const currentMonthRevenue = revenueData[revenueData.length - 1]
export const previousMonthRevenue = revenueData[revenueData.length - 2]
export const revenueGrowth = ((currentMonthRevenue.total - previousMonthRevenue.total) / previousMonthRevenue.total * 100).toFixed(1)
