
-- Agregar campos personales a la tabla profiles
ALTER TABLE public.profiles
ADD COLUMN gender text,
ADD COLUMN national_id text,
ADD COLUMN marital_status text,
ADD COLUMN birth_date date,
ADD COLUMN address text,
ADD COLUMN emergency_contact_name text,
ADD COLUMN emergency_contact_phone text;
