/**
 * Import all categories and products from products.ts into the database via API
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Product data from products.ts
const productsData = [
  {
    id: "Adapalene",
    name: "Adapalene",
    casNo: "106685-40-9",
    category: "API PRODUCT",
    description: "Adapalen is a topical retinoid primarily used for the treatment and prevention of acne vulgaris. It works by influencing skin cell growth, reducing inflammation, and unclogging pores.",
  },
  {
    id: "Amiodarone Hydrochloride",
    name: "Amiodarone Hydrochloride",
    casNo: "19774-82-4",
    category: "API PRODUCT",
    description: "Amiodarone HCI is an antiarrhythmic medication used primarily to treat severe, life-threatening heart rhythm disorders (arrhythmias).",
  },
  {
    id: "Itopride Hydrochloride",
    name: "Itopride Hydrochloride",
    casNo: "122892-31-3",
    category: "API PRODUCT",
    description: "Itopride Hydrochloride is a prescription medication primarily used as a gastroprokinetic agent to treat symptoms of gastrointestinal motility disorders.",
  },
  {
    id: "2-adamantyl-4-bromoanisole",
    name: "2-(1-adamantyl)-4-bromoanisole",
    casNo: "104224-63-7",
    category: "API INTERMEDIATE PRODUCT",
    description: "Intermediate compound used in the synthesis of Adapalene.",
  },
  {
    id: "methyl-6-adamantyl-naphthoate",
    name: "Methyl 6-[3-(1-adamantyl)-4-methoxyphenyl]-2-Naphthoate",
    casNo: "106685-41-0",
    category: "API INTERMEDIATE PRODUCT",
    description: "Intermediate compound used in the synthesis of Adapalene.",
  },
  {
    id: "2n-butyl-benzofuran",
    name: "2n Butyl Benzofuran",
    casNo: "4265-27-4",
    category: "API INTERMEDIATE PRODUCT",
    description: "Intermediate compound used in the synthesis of Amiodarone Hydrochloride.",
  },
  {
    id: "2-butylbenzofuran-3-yl-4-hydroxyphenyl-methanone",
    name: "(2-Butylbenzofuran-3-yl) (4-hydroxyphenyl)methanone",
    casNo: "52490-15-0",
    category: "API INTERMEDIATE PRODUCT",
    description: "Intermediate compound used in the synthesis of Amiodarone Hydrochloride.",
  },
  {
    id: "2-butyl-3-diiodo-hydroxy-benzoyl-benzofuran",
    name: "2-Butyl-3-(3,5-Diiodo-4-Hydroxy benzoyl) benzofuran",
    casNo: "1951-26-4",
    category: "API INTERMEDIATE PRODUCT",
    description: "Intermediate compound used in the synthesis of Amiodarone Hydrochloride.",
  },
  {
    id: "thiamine-hydrochloride",
    name: "Thiamine Hydrochloride",
    casNo: "67-03-8",
    category: "UNDER DEVELOPMENT API PRODUCT",
    description: "Vitamin B1 hydrochloride used for the treatment and prevention of thiamine deficiency.",
  },
  {
    id: "Minoxidil",
    name: "Minoxidil",
    casNo: "38304-91-5",
    category: "UNDER DEVELOPMENT API PRODUCT",
    description: "Vitamin B1 mononitrate used for the treatment and prevention of thiamine deficiency.",
  },
  {
    id: "lercanidipine-hydrochloride",
    name: "Lercanidipine Hydrochloride",
    casNo: "100427-26-7",
    category: "UNDER DEVELOPMENT API PRODUCT",
    description: "Calcium channel blocker used for the treatment of hypertension.",
  },
  {
    id: "ticagrelor",
    name: "Ticagrelor",
    casNo: "274693-27-5",
    category: "UNDER DEVELOPMENT API PRODUCT",
    description: "Antiplatelet medication used to prevent blood clots in patients with acute coronary syndrome.",
  },
  {
    id: "ezetimibe",
    name: "Ezetimibe",
    casNo: "163222-33-1",
    category: "UNDER DEVELOPMENT API PRODUCT",
    description: "Cholesterol-lowering medication that inhibits the absorption of cholesterol from the intestine.",
  },
  {
    id: "benfotiamine",
    name: "Benfotiamine",
    casNo: "22457-89-2",
    category: "UNDER DEVELOPMENT API PRODUCT",
    description: "Used to treat and prevent Vitamin B1 deficiency, including diabetic neuropathy and mental health symptoms.",
  },
  {
    id: "esomeprazole-magnesium-trihydrate",
    name: "Esomeprazole Megnassium Trihydrate",
    casNo: "217087-09-7",
    category: "UNDER SCALE-UP API PRODUCT",
    description: "Proton pump inhibitor used to treat gastroesophageal reflux disease and peptic ulcers.",
  },
  {
    id: "metoprolol-succinate",
    name: "Metoprolol Succinate",
    casNo: "98418-47-4",
    category: "UNDER SCALE-UP API PRODUCT",
    description: "Beta-blocker used to treat high blood pressure, chest pain, and heart failure.",
  },
  {
    id: "metoprolol-tartrate",
    name: "Metoprolol Tartrate",
    casNo: "56392-17-7",
    category: "UNDER SCALE-UP API PRODUCT",
    description: "Beta-blocker used to treat high blood pressure, chest pain, and heart failure.",
  },
  {
    id: "carvedilol",
    name: "Carvedilol",
    casNo: "72956-09-3",
    category: "UNDER SCALE-UP API PRODUCT",
    description: "Beta-blocker and alpha-blocker used to treat high blood pressure and heart failure.",
  },
  {
    id: "oxcarbazepine",
    name: "Oxcarbazepine",
    casNo: "28721-07-5",
    category: "UNDER SCALE-UP API PRODUCT",
    description: "Anticonvulsant medication used to treat epilepsy and seizures.",
  },
  {
    id: "glimepiride",
    name: "Glimepiride",
    casNo: "93479-97-1",
    category: "UNDER SCALE-UP API PRODUCT",
    description: "Antidiabetic medication used to treat type 2 diabetes mellitus.",
  },
  {
    id: "rosuvastatin-calcium",
    name: "Rosuvastatin Calcium",
    casNo: "147098-20-2",
    category: "UNDER SCALE-UP API PRODUCT",
    description: "Statin medication used to lower cholesterol and reduce the risk of cardiovascular disease.",
  },
  {
    id: "lornoxicam",
    name: "Lornoxicam",
    casNo: "70374-39-9",
    category: "UNDER SCALE-UP API PRODUCT",
    description: "Non-steroidal anti-inflammatory drug used to treat pain and inflammation.",
  },
];

// Configuration
const API_BASE_URL = 'http://localhost:3001/api';
const ADMIN_EMAIL = 'intechhealthcare@gmail.com';
const ADMIN_PASSWORD = 'Intech@Admin';

let authToken: string | null = null;

/**
 * Login and get authentication token
 */
async function login(): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    });

    if (!response.ok) {
      const error = await response.json() as { message?: string };
      throw new Error(`Login failed: ${error.message || response.statusText}`);
    }

    const data = await response.json() as { success?: boolean; data?: { token?: string }; message?: string };
    if (data.success && data.data?.token) {
      return data.data.token;
    }
    throw new Error('No token received from login');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Login error: ${errorMessage}`);
  }
}

/**
 * Create a category via API
 */
async function createCategory(categoryName: string, token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: categoryName,
        visible: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json() as { message?: string };
      // If category already exists, that's okay
      if (error.message?.includes('already exists')) {
        return true; // Consider it success
      }
      throw new Error(`Failed to create category: ${error.message || response.statusText}`);
    }

    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`  ❌ Error creating category "${categoryName}": ${errorMessage}`);
    return false;
  }
}

/**
 * Create multipart/form-data body manually
 */
function createMultipartFormData(fields: Record<string, string>): { body: string; boundary: string } {
  const boundary = `----WebKitFormBoundary${Date.now()}`;
  const parts: string[] = [];
  
  for (const [key, value] of Object.entries(fields)) {
    parts.push(`--${boundary}`);
    parts.push(`Content-Disposition: form-data; name="${key}"`);
    parts.push('');
    parts.push(value);
  }
  
  parts.push(`--${boundary}--`);
  
  return {
    body: parts.join('\r\n'),
    boundary,
  };
}

/**
 * Create a product via API
 */
async function createProduct(product: any, token: string): Promise<boolean> {
  try {
    // Since the API uses multer middleware, we need to send multipart/form-data
    const fields: Record<string, string> = {
      name: product.name,
      category: product.category,
      description: product.description,
      casNo: product.casNo || 'N/A',
      visible: 'true',
    };
    
    // Add info if available
    if (product.fullDescription) {
      fields.info = product.fullDescription;
    }

    const { body, boundary } = createMultipartFormData(fields);

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    if (!response.ok) {
      const error = await response.json() as { message?: string };
      // If product already exists, that's okay
      if (error.message?.includes('already exists')) {
        return true; // Consider it success
      }
      throw new Error(`Failed to create product: ${error.message || response.statusText}`);
    }

    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`  ❌ Error creating product "${product.name}": ${errorMessage}`);
    return false;
  }
}

/**
 * Main import function
 */
async function importData() {
  console.log('🚀 Starting product data import...\n');

  // Extract unique categories
  const categories = [...new Set(productsData.map(p => p.category))];
  console.log(`📊 Found ${categories.length} categories and ${productsData.length} products\n`);

  // Login
  console.log('🔐 Logging in...');
  try {
    authToken = await login();
    console.log('✅ Login successful\n');
  } catch (error: any) {
    console.error(`❌ Login failed: ${error.message}`);
    process.exit(1);
  }

  // Import categories
  console.log('📁 Importing categories...');
  let categoriesCreated = 0;
  let categoriesSkipped = 0;
  
  for (const categoryName of categories) {
    process.stdout.write(`  Creating category: ${categoryName}... `);
    const success = await createCategory(categoryName, authToken!);
    if (success) {
      categoriesCreated++;
      console.log('✅');
    } else {
      categoriesSkipped++;
      console.log('⚠️');
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n✅ Categories: ${categoriesCreated} processed, ${categoriesSkipped} skipped\n`);

  // Import products
  console.log('💊 Importing products...');
  let productsCreated = 0;
  let productsSkipped = 0;
  let productsFailed = 0;

  for (let i = 0; i < productsData.length; i++) {
    const product = productsData[i];
    process.stdout.write(`  [${i + 1}/${productsData.length}] Creating product: ${product.name}... `);
    const success = await createProduct(product, authToken!);
    if (success) {
      productsCreated++;
      console.log('✅');
    } else {
      productsFailed++;
      console.log('❌');
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`\n✅ Products: ${productsCreated} created, ${productsSkipped} skipped, ${productsFailed} failed\n`);

  // Summary
  console.log('📈 Import Summary:');
  console.log(`   Categories: ${categories.length} total`);
  console.log(`   Products: ${productsCreated} created`);
  if (productsFailed > 0) {
    console.log(`   Failed: ${productsFailed}`);
  }
  console.log('\n✨ Import complete!');
  console.log('\n💡 Next steps:');
  console.log('   1. Check the admin panel to verify all data');
  console.log('   2. Check the frontend to see products displayed');
}

// Run import
importData().catch((error) => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error('❌ Fatal error:', errorMessage);
  process.exit(1);
});
