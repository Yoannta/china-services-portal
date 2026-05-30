const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const uploadsDir = path.join(__dirname, 'uploads');

async function migrateImages() {
    if (!fs.existsSync(uploadsDir)) {
        console.log("Dossier /uploads introuvable.");
        return;
    }

    const files = fs.readdirSync(uploadsDir);
    console.log(`${files.length} fichiers trouvés. Début de la migration...`);

    for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        if (fs.lstatSync(filePath).isDirectory()) continue;

        const fileBuffer = fs.readFileSync(filePath);
        const { error } = await supabase.storage.from('uploads').upload(file, fileBuffer, {
            upsert: true,
            contentType: 'image/jpeg' // Simplifié
        });

        if (error) {
            console.error(`Erreur pour ${file}:`, error.message);
        } else {
            console.log(`✅ ${file} migré avec succès.`);
        }
    }
    console.log("Migration terminée !");
}

migrateImages();
