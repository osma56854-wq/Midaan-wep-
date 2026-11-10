drop policy if exists service_offers_insert_self on public.service_offers;
create policy service_offers_insert_self
  on public.service_offers for insert to authenticated
  with check (
    provider_id = (select auth.uid())
    and exists (
      select 1 from public.professional_profiles p
      where p.user_id = (select auth.uid())
        and (status <> 'published' or p.is_public = true)
    )
  );