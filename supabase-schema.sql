-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create families table
CREATE TABLE IF NOT EXISTS families (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create family_members table (junction table)
CREATE TABLE IF NOT EXISTS family_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(family_id, user_id)
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    ingredients JSONB NOT NULL DEFAULT '[]',
    steps TEXT[] NOT NULL DEFAULT '{}',
    prep_time INTEGER,
    cook_time INTEGER,
    category TEXT CHECK (category IN ('entrée', 'plat', 'dessert', 'autre')),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS recipes_user_id_idx ON recipes(user_id);
CREATE INDEX IF NOT EXISTS recipes_category_idx ON recipes(category);
CREATE INDEX IF NOT EXISTS recipes_created_at_idx ON recipes(created_at DESC);
CREATE INDEX IF NOT EXISTS family_members_user_id_idx ON family_members(user_id);
CREATE INDEX IF NOT EXISTS family_members_family_id_idx ON family_members(family_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Families RLS Policies
CREATE POLICY "Family members can view their families"
    ON families FOR SELECT
    USING (
        id IN (
            SELECT family_id FROM family_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Authenticated users can create families"
    ON families FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Family admins can update their families"
    ON families FOR UPDATE
    USING (
        id IN (
            SELECT family_id FROM family_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Family Members RLS Policies
CREATE POLICY "Users can view family members of their families"
    ON family_members FOR SELECT
    USING (
        family_id IN (
            SELECT family_id FROM family_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Family admins can insert members"
    ON family_members FOR INSERT
    WITH CHECK (
        family_id IN (
            SELECT family_id FROM family_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Family admins can delete members"
    ON family_members FOR DELETE
    USING (
        family_id IN (
            SELECT family_id FROM family_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Recipes RLS Policies
CREATE POLICY "Users can view recipes from their family"
    ON recipes FOR SELECT
    USING (
        -- User's own recipes
        user_id = auth.uid()
        OR
        -- Recipes from family members
        user_id IN (
            SELECT fm2.user_id
            FROM family_members fm1
            JOIN family_members fm2 ON fm1.family_id = fm2.family_id
            WHERE fm1.user_id = auth.uid()
        )
    );

CREATE POLICY "Authenticated users can insert recipes"
    ON recipes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes"
    ON recipes FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes"
    ON recipes FOR DELETE
    USING (auth.uid() = user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for recipes updated_at
DROP TRIGGER IF EXISTS update_recipes_updated_at ON recipes;
CREATE TRIGGER update_recipes_updated_at
    BEFORE UPDATE ON recipes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
