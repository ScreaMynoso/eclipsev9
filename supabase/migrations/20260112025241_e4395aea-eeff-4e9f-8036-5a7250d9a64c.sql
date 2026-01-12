-- Create enum for plan types
CREATE TYPE public.plan_type AS ENUM ('basic', 'premium', 'black');

-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  plan plan_type DEFAULT 'basic',
  key_activated BOOLEAN DEFAULT FALSE,
  activated_key_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table for admin access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create license_keys table
CREATE TABLE public.license_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  plan plan_type NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);

ALTER TABLE public.license_keys ENABLE ROW LEVEL SECURITY;

-- Create famous_players table
CREATE TABLE public.famous_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT,
  sensi_geral INTEGER NOT NULL DEFAULT 100,
  red_dot INTEGER NOT NULL DEFAULT 100,
  mira_2x INTEGER NOT NULL DEFAULT 100,
  mira_4x INTEGER NOT NULL DEFAULT 100,
  awm_sniper INTEGER NOT NULL DEFAULT 100,
  olhadinha INTEGER NOT NULL DEFAULT 100,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.famous_players ENABLE ROW LEVEL SECURITY;

-- Create favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_famous_players_updated_at
  BEFORE UPDATE ON public.famous_players
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for license_keys
CREATE POLICY "Users can view available keys for activation" ON public.license_keys
  FOR SELECT USING (is_used = FALSE OR used_by = auth.uid());

CREATE POLICY "Admins can manage keys" ON public.license_keys
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can activate keys" ON public.license_keys
  FOR UPDATE USING (is_used = FALSE)
  WITH CHECK (used_by = auth.uid());

-- RLS Policies for famous_players
CREATE POLICY "Anyone can view active players" ON public.famous_players
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage players" ON public.famous_players
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for favorites
CREATE POLICY "Users can view own favorites" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own favorites" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Insert admin role for renatonomercybr@gmail.com (will be applied when user signs up)
-- We'll create a trigger to auto-assign admin role

CREATE OR REPLACE FUNCTION public.assign_admin_on_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'renatonomercybr@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_admin_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.assign_admin_on_signup();

-- Insert initial famous players
INSERT INTO public.famous_players (name, image_url, sensi_geral, red_dot, mira_2x, mira_4x, awm_sniper, olhadinha) VALUES
  ('Nobru', '/players/nobru.png', 95, 100, 85, 70, 65, 110),
  ('Fantasma', '/players/fantasma.png', 90, 95, 80, 65, 60, 105),
  ('Two9', '/players/two9.png', 88, 92, 78, 68, 58, 100),
  ('Marechal', '/players/marechal.png', 85, 90, 75, 60, 55, 95),
  ('Freitas', '/players/freitas.png', 92, 98, 82, 72, 62, 108),
  ('Blackn444', '/players/blackn444.png', 87, 93, 77, 67, 57, 98),
  ('Xauan', '/players/xauan.png', 89, 94, 79, 69, 59, 102),
  ('Phzin', '/players/phzin.png', 91, 96, 81, 71, 61, 106),
  ('Apelapato', '/players/apelapato.png', 86, 91, 76, 66, 56, 97),
  ('Mandela', '/players/mandela.jpg', 93, 97, 83, 73, 63, 107),
  ('Dantes', '/players/dantes.jpg', 94, 99, 84, 74, 64, 109),
  ('Jotav', '/players/jotav.jpg', 88, 93, 78, 68, 58, 100);