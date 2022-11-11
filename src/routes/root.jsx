import { useEffect } from "react";
import { Outlet, useLoaderData, Form, redirect, NavLink, useNavigation, useSubmit } from "react-router-dom";
import { getContacts, createContact } from "../contacts";



export async function action(){
  const contact = await createContact();
  return  redirect(`/contacts/${contact.id}/edit`)
}

export async function loader({request}) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q')
  const contacts = await getContacts(q);
  return { contacts, q };
  
}

export default function Root() {
  const  {contacts, q}  = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit()
  
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    document.getElementById("q").value = q;
  },[q])

  return (
    <>
      <div id="sidebar">
        <h1>Schuch</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching? 'loading' : ""}
              aria-label="Search contacts"
              placeholder="Procurar"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(event) => {
                submit(event.currentTarget.form, {replace: !isFirstSearch})
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">Criar</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink 
                  to={`contacts/${contact.id}`}
                  className={({ isActive, isPending}) => isActive? "active" : isPending ? "pending" : ""}
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>Sem Nome</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>Sem Contatos</i>
            </p>
          )}
        </nav>
      </div>
      <div 
      id="detail"
      className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}
