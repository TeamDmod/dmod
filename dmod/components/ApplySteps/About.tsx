import { useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import styles from '../../styles/apply.module.scss';
import Buttons from '../../styles/buttons.module.scss';
import forms from '../../styles/forms.module.scss';
import FormField from '../Forms/text_area';
import Selector from '../Forms/selector';
import DatePicker from '../Forms/date_picker';


function About(props) {

	let [data, setData] = useState({})

	const { register, handleSubmit, reset, watch, formState: { errors }, control } = useForm({ mode: 'onTouched' });

	const { isValid, isDirty } = useFormState({ control });

	const updateData = async ({ about, description, pronouns, birthday }) => {

		console.log(data)

		setData({ ...data, about, description, pronouns, birthday })
		reset({ about, description, pronouns, birthday });

	};

	return (
		<div className={styles.fade_in_container}>
			<form onSubmit={handleSubmit(updateData)}>
				<FormField image={"/pencil.png"} placeholder={"Write your about text here"} name={"About"} error={errors.about} register={{
					...register("about", {
						maxLength: 20,
						required: true,
					})
				}} />
				<FormField image={"/pencil.png"} placeholder={"Write your text here"} name={"Why do you want to be a mod?"} error={errors.description} register={{
					...register("description", {
						maxLength: 20,
						required: true,
					})
				}} />
				<Selector image={"/gender.png"} name={"Pronouns (We also support pronoundb)"} items={["He/Him", "She/Her", "They/Them", "Other"]} />
				<DatePicker></DatePicker>
				<div className={styles.button_container_form}>
					<button className={`${Buttons.small_button} ${Buttons.border} ${forms.button_spacer}`} name={"back"} >Go Back</button>
					<button className={`${Buttons.small_button} ${Buttons.colored}`} name={"forward"}>Next</button>
				</div>
			</form>
		</div>
	);
}


export default About;