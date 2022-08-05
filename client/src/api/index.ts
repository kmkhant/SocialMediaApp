import axios from "axios";
import {
	ISearchQuery,
	ISignInForm,
	ISignUpForm,
} from "../types";

const API = axios.create({
	baseURL: "http://localhost:5000",
});

API.interceptors.request.use((req) => {
	if (localStorage.getItem("user")) {
		req.headers!.Authorization = `Bearer ${
			JSON.parse(localStorage.getItem("user") || "").token
		}`;
	}

	return req;
});

export const fetchAllPost = () => API.get(`/posts/all`);

export const fetchPost = (id: string) =>
	API.get(`/posts/${id}`);
export const fetchPosts = (page: number) =>
	API.get(`/posts?page=${page}`);
export const fetchPostsByCreator = (name: string) =>
	API.get(`/posts/creator?name=${name}`);
export const fetchPostsBySearch = (
	searchQuery: ISearchQuery
) =>
	API.get(
		`/posts/search?searchQuery=${
			searchQuery.search || "none"
		}&tags=${searchQuery.tags}`
	);
export const createPost = (newPost: FormData) =>
	API.post("/posts", newPost);
export const likePost = (id: string) =>
	API.patch(`/posts/${id}/likePost`);
export const comment = (value: string, id: string) =>
	API.post(`/posts/${id}/commentPost`, { value });
export const updatePost = (
	id: string,
	updatedPost: FormData
) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id: string) =>
	API.delete(`/posts/${id}`);

export const signIn = (formData: ISignInForm) =>
	API.post("/user/signin", formData);
export const signUp = (formData: ISignUpForm) =>
	API.post("/user/signup", formData);
