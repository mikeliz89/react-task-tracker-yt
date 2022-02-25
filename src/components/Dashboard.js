import { Link } from 'react-router-dom'
import BigButton from '../components/BigButton'

export default function Dashboard() {

    return (
        <div>
              <Link to={`/managerecipes`}><BigButton textcolor="white" color="#b37401" text="Manage Recipes" /></Link>
              <Link to={`/managetasklists`}><BigButton color="green" text="Manage Task Lists" /></Link>
              <Link to={'/bmicalculator'}><BigButton text="BMI Calculator" /></Link>
{/*               <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link> */}
        </div>
    )
}
