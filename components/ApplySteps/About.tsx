import { useForm } from 'react-hook-form';
import { applyData } from 'pages/apply';
import styles from 'styles/apply.module.scss';
import Buttons from 'styles/buttons.module.scss';
import forms from 'styles/forms.module.scss';
import DatePicker from '../Forms/date_picker';
import Selector from '../Forms/selector';
import FormField from '../Forms/text_area';
import { useState } from 'react';

interface props {
  onSubmit: (submitter: string, newData: applyData) => void;
  data: [applyData, React.Dispatch<React.SetStateAction<applyData>>];
}

function About(props: props) {
  const [data, setData] = props.data;
  const [canContinue, setContionue] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({ mode: 'onTouched' });

  // const { isValid, isDirty } = useFormState({ control });

  const updateData = async ({ about, description }) => {
    setData({ ...data, about, description });
    reset({ about, description });

    if (Object.keys(data).every(k => data[k] !== null)) return setContionue(true);
    setContionue(false);
  };

  return (
    <div className={styles.fade_in_container}>
      <form onSubmit={handleSubmit(updateData)}>
        <FormField
          image={'/pencil.png'}
          placeholder={'Write your about text here'}
          name={'About'}
          error={errors.about}
          register={{
            ...register('about', {
              maxLength: 20,
              required: true,
            }),
          }}
        />
        <FormField
          image={'/pencil.png'}
          placeholder={'Write your text here'}
          name={'Why do you want to be a mod?'}
          error={errors.description}
          register={{
            ...register('description', {
              maxLength: 20,
              required: true,
            }),
          }}
        />
        <Selector
          onChange={text => setData({ ...data, pronouns: text })}
          image={'/gender.png'}
          name={'Pronouns (We also support pronoundb)'}
          items={['He/Him', 'She/Her', 'They/Them', 'Other']}
        />
        <DatePicker date={data.birthday} onChange={date => setData({ ...data, birthday: date })} />
        <div className={styles.button_container_form}>
          <button
            onClick={() => {
              if (!canContinue) return;
              props.onSubmit('back', data);
            }}
            className={`${Buttons.small_button} ${Buttons.border} ${forms.button_spacer}`}
            name={'back'}
          >
            Go Back
          </button>
          <button
            onClick={() => {
              if (!canContinue) return;
              props.onSubmit('forward', data);
            }}
            className={`${Buttons.small_button} ${Buttons.colored}`}
            name={'forward'}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}

export default About;
