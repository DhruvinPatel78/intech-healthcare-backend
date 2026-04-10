# Import Products Script

This script imports all categories and products from the `products.ts` file into the database via the admin API.

## Prerequisites

1. Make sure the backend server is running
2. Ensure you have admin credentials set up (default: `intechhealthcare@gmail.com` / `Intech@Admin`)
3. MongoDB should be connected and running

## Usage

### Run the import script:

```bash
cd intech-healthcare-backend
npm run import-products
```

Or directly with tsx:

```bash
tsx src/scripts/import_products.ts
```

## What it does

1. **Logs in** as admin using credentials from `.env` or defaults
2. **Creates all categories** found in the products data:
   - API PRODUCT
   - API INTERMEDIATE PRODUCT
   - UNDER DEVELOPMENT API PRODUCT
   - UNDER SCALE-UP API PRODUCT
3. **Creates all products** with their details:
   - Product name
   - CAS number
   - Category
   - Description
   - Visibility status

## Configuration

The script uses environment variables from `.env`:

- `API_URL` - API base URL (default: `http://localhost:5000/api`)
- `ADMIN_EMAIL` - Admin email (default: `intechhealthcare@gmail.com`)
- `ADMIN_PASSWORD` - Admin password (default: `Intech@Admin`)

## Notes

- The script will skip categories/products that already exist (no errors)
- Products are created with `visible: true` by default
- The script includes a small delay between requests to avoid rate limiting
- All products from `products.ts` are included in the script

## Products Included

The script imports **23 products** across **4 categories**:

- **API PRODUCT** (3 products): Adapalene, Amiodarone Hydrochloride, Itopride Hydrochloride
- **API INTERMEDIATE PRODUCT** (5 products): Various intermediates for Adapalene and Amiodarone
- **UNDER DEVELOPMENT API PRODUCT** (6 products): Thiamine, Minoxidil, Lercanidipine, Ticagrelor, Ezetimibe, Benfotiamine
- **UNDER SCALE-UP API PRODUCT** (9 products): Esomeprazole, Metoprolol variants, Carvedilol, Oxcarbazepine, Glimepiride, Rosuvastatin, Lornoxicam

## After Import

1. Check the admin panel (`http://localhost:5174` or your admin URL) to verify all categories and products
2. Check the frontend (`http://localhost:5173` or your frontend URL) to see products displayed
3. All products should now be visible and searchable on the frontend
