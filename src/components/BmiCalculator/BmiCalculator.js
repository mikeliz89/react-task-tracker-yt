import React, {useState} from 'react'
import GoBackButton from '../GoBackButton'

const BmiCalculator = () => {

  //states
  const [BMI, setBMI] = useState(0)
  const [weight, setWeight] = useState(0)
  const [height, setHeight] = useState(0)
    
  async function onSubmit(e) {
    e.preventDefault()

    let BMITemp = 0;
    let heightInMeters = height / 100;
    BMITemp = weight / (heightInMeters * heightInMeters);
    let BMIRounded = Math.round(BMITemp*10)/10;
    setBMI(BMIRounded);
  }

  return (
    <div>
        <h3 className="page-title">BMI Calculator</h3>
        <GoBackButton />

        <form className='add-form' onSubmit={onSubmit}>
                <div className='form-control'>
                    <label>Height</label>
                    <input type='number' placeholder='Height' value={height} onChange={(e) => setHeight(e.target.value)} />
                </div>
                <div className='form-control'>
                    <label>Weight</label>
                    <input type='number' placeholder='Weight' value={weight} onChange={(e) => setWeight(e.target.value)} />
                </div>
                <input type='submit' value='Calculate BMI' className='btn btn-block' />
            </form>

        { BMI > 0 &&
        <div>
         Your Body mass index is : {BMI}
        </div>
        }
        <table>
            <tbody>
            <tr>
                <td>Sairaalloinen alipaino</td>
                <td>0 - 14,9</td>
            </tr>
            <tr>
                <td>Merkittävä alipaino</td>
                <td>15 - 17,9</td>
            </tr>
            <tr>
                <td>Lievä alipaino</td>
                <td>18 - 18,9</td>
            </tr>
            <tr>
                <td>Normaali paino</td>
                <td>19 - 24,9</td>
            </tr>
            <tr>
                <td>Lievä ylipaino</td>
                <td>25,0 - 29,9</td>
            </tr>
            <tr>
                <td>Merkittävä ylipaino</td>
                <td>30,0 - 34,9</td>
            </tr>
            <tr>
                <td>Vaikea ylipaino</td>
                <td>35,0 - 39,9</td>
            </tr>
            <tr>
                <td>Sairaalloinen ylipaino</td>
                <td>40,0 tai enemmän</td>
            </tr>
            </tbody>
        </table>
    </div>
  )
}

export default BmiCalculator