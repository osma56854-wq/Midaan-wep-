create policy "skill_evidence_delete_own_upload"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'skill-evidence'
  and (storage.foldername(name))[2] = (select auth.uid())::text
  and exists (
    select 1
    from public.organization_members m
    where m.organization_id::text = (storage.foldername(name))[1]
      and m.user_id = (select auth.uid())
      and m.status = 'active'
  )
);
