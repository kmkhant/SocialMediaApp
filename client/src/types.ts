// define a type for the posts slice state
export interface IPost {
	_id: string;
	title: string;
	message: string;
	creator: string;
	selectedFile: string;
	tags: string[];
	likes: string[];
	comments: string[];
	createdAt: Date;
}

export interface ICreatePost {
	title: string;
	message: string;
	selectedFile: string;
	creator: string;
	tags: string[];
}

export interface ISearchQuery {
	search: string | undefined;
	tags: string | undefined;
}

export interface ISignUpForm {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export interface ISignInForm {
	email: string;
	password: string;
}

export interface ISignUpForm {
	email: string;
	password: string;
	confirmPassword: string;
	firstName: string;
	lastName: string;
}

export interface IAuthState {
	isLoading: boolean;
	hasError: boolean;
}

export interface IUser {
	result: {
		_id: string;
		name: string;
		email: string;
		password: string;
		imageUrl: string;
		__v: number;
	};
	token: string;
}
