import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://izspwgppspdunzmvhfuv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6c3B3Z3Bwc3BkdW56bXZoZnV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMTMwNjMsImV4cCI6MjA1NjU4OTA2M30.8MlYW-MIijkclQPUEd4SZRYCj4yWHuy3w9IrZfdXY_Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 