import Round from "./Round";

export default function Rounds({ items, onDelete }) {

   return (
      <>
         {
            items.map((round) => (
               <Round key={round.id} round={round} onDelete={onDelete} />
            ))
         }
      </>
   )
}

