alter table public.rfq_quotes add column rfq_title text;
create or replace function public.prepare_rfq_quote_context()
returns trigger
language plpgsql
set search_path=pg_catalog,public
as $$
declare v_title text;
begin
 select title into v_title from public.industrial_rfqs
 where id=new.rfq_id and status='open';
 if not found then raise exception 'طلب عروض الأسعار لم يعد مفتوحًا'; end if;
 new.rfq_title:=v_title;
 return new;
end;
$$;
revoke all on function public.prepare_rfq_quote_context() from public,anon,authenticated;
create trigger rfq_quotes_prepare_context
before insert on public.rfq_quotes
for each row execute function public.prepare_rfq_quote_context();