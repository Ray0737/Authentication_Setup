-- SQL Migration: Chat Enhancement (v2 with RLS fixes)
-- Run this in your Supabase SQL Editor to support the new message features

ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS reply_to_id UUID;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS reply_context JSONB;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS file_url TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS file_name TEXT;

-- 1. DROP old policies to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can view messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;

-- 2. SECURE SELECT: Only group members can view messages
CREATE POLICY "Group members can view messages"
ON public.messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.groups
        WHERE id = public.messages.group_id
        -- Optimized check for both UUID[] and TEXT[] member arrays
        AND auth.uid()::text = ANY(members::text[])
    )
);

-- 3. SECURE INSERT: Only group members can send messages
CREATE POLICY "Group members can send messages"
ON public.messages FOR INSERT
WITH CHECK (
    auth.uid() = sender_id 
    AND EXISTS (
        SELECT 1 FROM public.groups
        WHERE id = group_id
        -- Optimized check for both UUID[] and TEXT[] member arrays
        AND auth.uid()::text = ANY(members::text[])
    )
);

-- 4. ROSTER MANAGEMENT: Allow owners to update their group members (KICK/ADD)
DROP POLICY IF EXISTS "Owner Update Groups" ON public.groups;
CREATE POLICY "Owner Update Groups" ON public.groups FOR UPDATE
USING (auth.uid() = created_by);

-- 5. RECRUITMENT SYNC: Allow owners to update bookings during sync-removals
DROP POLICY IF EXISTS "Hub Owner Update Booking" ON public.intelligence_booking;
CREATE POLICY "Hub Owner Update Booking" ON public.intelligence_booking FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.intelligence_hub 
        WHERE id = intelligence_booking.hub_id 
        AND created_by = auth.uid()
    )
);

-- Note: Chat assets are saved under 'chat_assets/' in your Supabase storage. 
-- Ensure your RLS policies for storage allow authenticated uploads.
