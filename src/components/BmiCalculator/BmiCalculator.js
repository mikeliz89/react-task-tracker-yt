import React, {useState} from 'react'
import GoBackButton from '../GoBackButton'
import { useTranslation } from 'react-i18next';

const BmiCalculator = () => {

  const { t } = useTranslation();

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
        <h3 className="page-title">{t('bmi_calculator_title')}</h3>
        <GoBackButton />

        <form className='add-form' onSubmit={onSubmit}>
                <div className='form-control'>
                    <label>{t('height')}</label>
                    <input type='number' placeholder={t('height')} value={height} onChange={(e) => setHeight(e.target.value)} />
                </div>
                <div className='form-control'>
                    <label>{t('weight')}</label>
                    <input type='number' placeholder={t('weight')} value={weight} onChange={(e) => setWeight(e.target.value)} />
                </div>
                <input type='submit' value={t('calculate_bmi')} className='btn btn-block' />
            </form>

        { BMI > 0 &&
        <div>
         {t('your_bmi_is')} : {BMI}
        </div>
        }
        <table>
            <tbody>
            <tr>
                <td>{t('bmi_1')}</td>
                <td>0 - 14,9</td>
            </tr>
            <tr>
                <td>{t('bmi_2')}</td>
                <td>15 - 17,9</td>
            </tr>
            <tr>
                <td>{t('bmi_3')}</td>
                <td>18 - 18,9</td>
            </tr>
            <tr>
                <td>{t('bmi_4')}</td>
                <td>19 - 24,9</td>
            </tr>
            <tr>
                <td>{t('bmi_5')}</td>
                <td>25,0 - 29,9</td>
            </tr>
            <tr>
                <td>{t('bmi_6')}</td>
                <td>30,0 - 34,9</td>
            </tr>
            <tr>
                <td>{t('bmi_7')}</td>
                <td>35,0 - 39,9</td>
            </tr>
            <tr>
                <td>{t('bmi_8')}</td>
                <td>40,0 {t('bmi_ormore')}</td>
            </tr>
            </tbody>
        </table>
    </div>
  )
}

export default BmiCalculator