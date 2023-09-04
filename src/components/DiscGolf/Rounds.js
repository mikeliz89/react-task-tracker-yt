import Round from "./Round";

export default function Rounds({ rounds, onDelete }) {

   return (
      <>
         {
            rounds.map((round) => (
               <Round key={round.id} round={round} onDelete={onDelete} />
            ))
         }
      </>
   )
}