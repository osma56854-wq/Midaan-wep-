drop policy if exists service_requests_provider_update on public.service_requests;
drop policy if exists service_requests_requester_cancel on public.service_requests;

create policy service_requests_update_status_participant
  on public.service_requests for update to authenticated
  using (
    (provider_id = (select auth.uid()) and status in ('new','accepted'))
    or (requested_by = (select auth.uid()) and status = 'new')
  )
  with check (
    (provider_id = (select auth.uid()) and status in ('accepted','declined','completed'))
    or (requested_by = (select auth.uid()) and status = 'cancelled')
  );

create index if not exists service_requests_offer_created
  on public.service_requests (offer_id, created_at desc);