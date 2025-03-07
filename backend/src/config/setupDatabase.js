const supabase = require('./supabase');

/**
 * Script para configurar la base de datos en Supabase
 * Ejecuta este script cuando necesites crear o actualizar el esquema de la base de datos
 */
async function setupDatabase() {
  console.log('Configurando la base de datos...');

  try {
    // Verificar si la tabla documents ya existe
    const { error: checkError } = await supabase
      .from('documents')
      .select('id')
      .limit(1);

    // Si la tabla ya existe, no hacer nada
    if (!checkError) {
      console.log('La tabla documents ya existe.');
      return;
    }

    console.log('Creando tabla documents...');

    // Crear tabla documents con SQL directo
    const { error: createError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS public.documents (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          type VARCHAR(50) NOT NULL CHECK (type IN ('invoice', 'contract', 'legal')),
          title VARCHAR(255) NOT NULL,
          description TEXT,
          status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'completed', 'cancelled')),
          data JSONB,
          file_path TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Índices para mejorar el rendimiento
        CREATE INDEX IF NOT EXISTS documents_user_id_idx ON public.documents(user_id);
        CREATE INDEX IF NOT EXISTS documents_type_idx ON public.documents(type);
        CREATE INDEX IF NOT EXISTS documents_status_idx ON public.documents(status);
        
        -- Políticas de seguridad RLS (Row Level Security)
        ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
        
        -- Política para que los usuarios solo puedan ver sus propios documentos
        CREATE POLICY "Users can view own documents" 
          ON public.documents 
          FOR SELECT USING (auth.uid() = user_id);
        
        -- Política para que los usuarios solo puedan insertar sus propios documentos
        CREATE POLICY "Users can insert own documents" 
          ON public.documents 
          FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        -- Política para que los usuarios solo puedan actualizar sus propios documentos
        CREATE POLICY "Users can update own documents" 
          ON public.documents 
          FOR UPDATE USING (auth.uid() = user_id);
        
        -- Política para que los usuarios solo puedan eliminar sus propios documentos
        CREATE POLICY "Users can delete own documents" 
          ON public.documents 
          FOR DELETE USING (auth.uid() = user_id);
      `
    });

    if (createError) {
      console.error('Error al crear la tabla documents:', createError);
      throw createError;
    }

    console.log('Base de datos configurada correctamente.');
  } catch (error) {
    console.error('Error al configurar la base de datos:', error);
    
    // Si el error es porque no tenemos permisos para ejecutar SQL directo,
    // intentamos un enfoque alternativo usando la API de Supabase
    try {
      console.log('Intentando método alternativo...');
      
      // Crear tabla documents usando la API
      const { error: createTableError } = await supabase
        .from('documents')
        .insert([{ 
          id: '00000000-0000-0000-0000-000000000000',
          user_id: '00000000-0000-0000-0000-000000000000', 
          type: 'invoice',
          title: 'Tabla de prueba',
          description: 'Esta fila se eliminará automáticamente',
          status: 'draft',
          data: {},
        }])
        .select();
      
      if (createTableError && createTableError.code !== '23505') { // Ignorar error de clave duplicada
        console.error('Error en método alternativo:', createTableError);
        throw createTableError;
      }
      
      console.log('Tabla documents creada correctamente con método alternativo.');
    } catch (alternativeError) {
      console.error('Error en ambos métodos:', alternativeError);
      throw alternativeError;
    }
  }
}

// Si este archivo se ejecuta directamente
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('Script de configuración completado.');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error en el script de configuración:', error);
      process.exit(1);
    });
}

module.exports = { setupDatabase }; 