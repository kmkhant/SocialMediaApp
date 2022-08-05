import React from "react";

type FormProps = {
	currentId: string;
	setCurrentId: React.Dispatch<
		React.SetStateAction<string>
	>;
};
const Form: React.FC<FormProps> = ({
	currentId,
	setCurrentId,
}) => {
	return (
		<div>
			<p>Tag Form</p>
		</div>
	);
};

export default Form;
