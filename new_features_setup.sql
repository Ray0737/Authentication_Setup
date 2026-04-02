-- 1. Redefine Messages with explicit link to Profiles
DROP TABLE IF EXISTS public.messages;
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    text TEXT,
    image_url TEXT
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view messages"
ON public.messages FOR SELECT
USING ( auth.role() = 'authenticated' );

CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
WITH CHECK ( auth.uid() = sender_id );

-- 2. Add Purge Policies for Groups
DROP POLICY IF EXISTS "Users can delete their own groups" ON public.groups;
CREATE POLICY "Users can delete their own groups"
ON public.groups FOR DELETE
USING ( auth.uid() = created_by );

-- 3. Add Purge Policy for Messages (History Clear)
CREATE POLICY "Only group creators can purge messages"
ON public.messages FOR DELETE
USING ( 
    EXISTS (
        SELECT 1 FROM public.groups 
        WHERE id = public.messages.group_id 
        AND created_by = auth.uid()
    )
);

-- 4. Add Calendar End Tracking & Sharing
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS "end" TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS "shared_with" UUID[] DEFAULT '{}';
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE public.calendar_events ADD COLUMN IF NOT EXISTS "color" VARCHAR(50);

-- 5. Establish ROW LEVEL SECURITY for Calendar Events
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for visible events" ON public.calendar_events;
CREATE POLICY "Enable read access for visible events" ON public.calendar_events FOR SELECT USING ( scope = 'global' OR created_by = auth.uid() OR auth.uid() = ANY(shared_with) );

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.calendar_events;
CREATE POLICY "Enable insert for authenticated users" ON public.calendar_events FOR INSERT WITH CHECK ( auth.uid() = created_by );

DROP POLICY IF EXISTS "Enable update for creator" ON public.calendar_events;
CREATE POLICY "Enable update for creator" ON public.calendar_events FOR UPDATE USING ( auth.uid() = created_by );

DROP POLICY IF EXISTS "Enable delete for creator" ON public.calendar_events;
CREATE POLICY "Enable delete for creator" ON public.calendar_events FOR DELETE USING ( auth.uid() = created_by );


-- ============================================================
-- 6. WORK GRID / RECRUITMENT SYSTEM (Singular table names)
-- ============================================================

-- If you already had the old plural tables with data, rename them first:
-- ALTER TABLE public.intelligence_hubs RENAME TO intelligence_hub;
-- ALTER TABLE public.intelligence_bookings RENAME TO intelligence_booking;

-- Otherwise, create fresh:

CREATE TABLE IF NOT EXISTS public.intelligence_hub (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES public.profiles(id) DEFAULT auth.uid(),
    title TEXT NOT NULL,
    status TEXT DEFAULT 'ACTIVE',
    tags TEXT[] DEFAULT '{}',
    description TEXT,
    scope TEXT DEFAULT 'global'
);

CREATE TABLE IF NOT EXISTS public.intelligence_booking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    hub_id UUID NOT NULL REFERENCES public.intelligence_hub(id) ON DELETE CASCADE,
    team_name TEXT NOT NULL,
    member_ids JSONB DEFAULT '[]',
    slot_code TEXT
);

-- 6a. Link Groups to Intelligence Hub
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS "linked_hub_id" UUID;
ALTER TABLE public.groups DROP CONSTRAINT IF EXISTS groups_linked_hub_id_fkey;
ALTER TABLE public.groups ADD CONSTRAINT groups_linked_hub_id_fkey 
    FOREIGN KEY (linked_hub_id) REFERENCES public.intelligence_hub(id) ON DELETE CASCADE;

-- 6b. RLS for intelligence_hub
ALTER TABLE public.intelligence_hub ENABLE ROW LEVEL SECURITY;

-- SELECT: everyone can view
DROP POLICY IF EXISTS "Public View Hub" ON public.intelligence_hub;
CREATE POLICY "Public View Hub"
ON public.intelligence_hub FOR SELECT
USING (true);

-- INSERT: authenticated users can create posts
DROP POLICY IF EXISTS "Authenticated Insert Hub" ON public.intelligence_hub;
CREATE POLICY "Authenticated Insert Hub"
ON public.intelligence_hub FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- UPDATE: only the creator can edit their own posts
DROP POLICY IF EXISTS "Owner Update Hub" ON public.intelligence_hub;
CREATE POLICY "Owner Update Hub"
ON public.intelligence_hub FOR UPDATE
USING (auth.uid() = created_by);

-- DELETE: only the creator can purge their own posts
DROP POLICY IF EXISTS "Owner Delete Hub" ON public.intelligence_hub;
CREATE POLICY "Owner Delete Hub"
ON public.intelligence_hub FOR DELETE
USING (auth.uid() = created_by);

-- 6c. RLS for intelligence_booking
ALTER TABLE public.intelligence_booking ENABLE ROW LEVEL SECURITY;

-- SELECT: everyone can view bookings
DROP POLICY IF EXISTS "Public View Booking" ON public.intelligence_booking;
CREATE POLICY "Public View Booking"
ON public.intelligence_booking FOR SELECT
USING (true);

-- INSERT: authenticated users can request to join
DROP POLICY IF EXISTS "Authenticated Insert Booking" ON public.intelligence_booking;
CREATE POLICY "Authenticated Insert Booking"
ON public.intelligence_booking FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- DELETE: the post owner can remove bookings from their posts
DROP POLICY IF EXISTS "Post Owner Delete Booking" ON public.intelligence_booking;
CREATE POLICY "Post Owner Delete Booking"
ON public.intelligence_booking FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.intelligence_hub 
        WHERE id = intelligence_booking.hub_id 
        AND created_by = auth.uid()
    )
);
