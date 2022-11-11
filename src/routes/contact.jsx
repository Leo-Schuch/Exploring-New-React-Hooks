import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { getContact, updateContact } from "../contacts";

export async function action ({request, params}){
  let formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  })
}

export async function loader({ params }) {
  return getContact(params.contactId);
}

export default function Contact() {
  const contact = useLoaderData();

  return (
    <div id="contact">
      <div>
        <img key={contact.avatar} src={contact.avatar || null} />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>Sem Nome</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Editar</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm("Você realmente deseja deletar?")) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Deletar</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }) {
  const fetcher = useFetcher();
  
  let favorite = contact.favorite;
  if(fetcher.formData){
    favorite = fetcher.formData.get("favorite") === "true"
  }
  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={
          favorite
           ? "Remover dos Favoritos" 
           : "Adicionar aos Favoritos"
        }
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
