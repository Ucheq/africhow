// import React, { useEffect, useRef, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { Countries } from "../phone/countrycode";
// import OnboardingButton from "../components/OnboardingButton";
// import axios from "axios";
// import Header from "../components/Header";
// import OnboardingWelcome from "../components/OnboardingWelcome";
// import "../onboardingloginsignup.css";
// import { auth } from "../../firebase";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import Nav from '../components/homeNav';
// import Loader from "../components/LoaderOnboarding";
import PasswordEye from "../assets/Vector.png";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Countries } from "../phone/countrycode";
import OnboardingButton from "../components/OnboardingButton";
import axios from "axios";
import OnboardingWelcome from "../components/OnboardingWelcome";
import "../onboardingloginsignup.css";
import { db, auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc, addDoc, runTransaction } from 'firebase/firestore';
import Nav from "../components/homeNav";
import Loader from "../components/LoaderOnboarding";
import Header from "../components/Header";
export default function OnBoardingSignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  // const [countries, SetCountries] = useState([]);
  // const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [query, setQuery] = useState("AF");
  const { register, handleSubmit, formState } = useForm();
  const { errors, isValid, isDirty } = formState;
  const navigate = useNavigate();
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return (() => {
      mounted.current = false;
    });
  });

  const handleSignUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((err) => {
        alert(err);
      });
  };

  // useEffect(() => {
  //   const config = {
  //     method: "get",
  //     url: `https://api.countrystatecity.in/v1/countries/${query}/cities`,
  //     headers: {
  //       "X-CSCAPI-KEY": "API_KEY",
  //     },
  //   };

  //   axios(config)
  //     .then((res) => {
  //       console.log(JSON.stringify(response.data));
  //       SetCountries(JSON.stringify(res.data));
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);
  // useEffect(() => {
  //   mounted.current = true;
  //   return (() => {
  //     mounted.current = false;
  //   });
  // });
  useEffect(() => {
    const config = {
      method: "get",
      url: "https://api.countrystatecity.in/v1/countries",
      headers: {
        "X-CSCAPI-KEY":
          "cTg3cGhFY3dnQjQyb0lONmpETnhaVlMwOHlQWjB5ZEcwcjVjQVJzTw==",
      },
    };

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        setCountries(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const config = {
      method: "get",
      url: `https://api.countrystatecity.in/v1/countries/${query}/cities`,
      headers: {
        "X-CSCAPI-KEY":
          "cTg3cGhFY3dnQjQyb0lONmpETnhaVlMwOHlQWjB5ZEcwcjVjQVJzTw==",
      },
    };

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        setCities(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [query]);

  const handleCountryChange = (e) => {
    const value = e.target.value.slice(0,2);
    setQuery(value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    console.log(data);

    // Create a new user document in the Firestore "users" collection
    try {
      const user = auth.currentUser;
      if (user) {
        const userUID = user.uid;

        const userDocRef = doc(db, 'users', userUID);
        const mealsCollectionRef = collection(userDocRef, 'meals');

        await runTransaction(db, async () => {
          await setDoc(userDocRef, {
          firstName: data.Firstname,
          lastName: data.Lastname,
          businessName: data.Businessname,
          storeAddress: data.Storeaddress,
          // Add other user data fields here
        });

        // Create the "meals" subcollection
        await addDoc(mealsCollectionRef, { exampleField: 'exampleValue' });
    });

      console.log('Document written with ID: ', userUID);
      }
    } catch (error) {
      console.error('Error adding document: ', error);
    }


  //function onSubmit(data) {
    console.log(data);
    setIsLoading(true)
    navigate("/account%20created%20successfully");
    setIsLoading(false)
  }

  function onError(errors) {
    console.log(errors);
  }


  return (
    <div>
      <div className="relative"/>
      <Header/>
      <div className=" mx-auto min-[391px]:w-4/5 max-[390px]:w-[358px] flex flex-col gap-3">
        <OnboardingWelcome
          title={"Complete account setup"}
          text={"You're one-step away from selling your product to 1M+ people"}
          className={"welcome"}
        />
        <form
          className="grid gap-3 w-full"
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <div className="grid gap-2">
            <label className="label text flex gap-2">
              First Name <span className="text-[#CB0000]">*</span>
            </label>
            <input
              type="text"
              id="Firstname"
              placeholder="Sarah"
              {...register("Firstname", {
                required: "Required",
                pattern: {
                  value: /^[A-Za-z]+$/,
                  message: "invalid first name",
                },
              })}
              className="input"
            />
          </div>
          <span className="text-red-500 text-[12px]">
            {errors?.Firstname && errors?.Firstname?.message}
          </span>
          <div className="grid gap-2">
            <label className="label text flex gap-2">
              Last Name <span className="text-[#CB0000]">*</span>
            </label>
            <input
              type="text"
              id="Lastname"
              placeholder="John"
              {...register("Lastname", {
                required: "Required",
                pattern: {
                  value: /^[A-Za-z]+$/,
                  message: "invalid Last name",
                },
              })}
              className="input"
            />
          </div>

          <span className="text-red-500 text-[12px]">
            {errors?.Lastname && errors?.Lastname?.message}
          </span>
          <div className="grid gap-2 parentinput">
            <label className=" font-[500] w-full max-[390px]:text-[12px] text text-left justify-start flex gap-2">
              Phone Number <span className="text-[#CB0000]">*</span>
            </label>
            <span className="flex justify-between w-full max-[390px]:w-[358px] mx-auto">
              <select className="border  max-[390px]:w-[71px] w-[30%]">
                {Countries.map((country) => (
                  <option className="flex flex-rowb" key={country.id}>
                    {country.id} ({country.code})
                  </option>
                ))}
              </select>
              <input
                className="max-[390px]:w-[278px] w-[50%] border"
                type="text"
                id="phonenumber"
                placeholder="123-456-7891"
                {...register("phonenumber", {
                  required: "Required",
                  pattern: {
                    value: /^[0-9]{10,13}$/,
                    message: "invalid phone number",
                  },
                })}
              />
            </span>
          </div>

          <div className="grid gap-2">
            <label className="label text flex gap-2">
              Business Name <span className="text-[#CB0000]">*</span>
            </label>
            <input
              type="text"
              id="Businessname"
              placeholder="The SpiceKitchen"
              {...register("Businessname", {
                required: "Required",
                // pattern: {
                //   value: /[A-Za-z0-9'\.\-\s\,]/,
                //   message: "invalid Business name",
                // },
              })}
              className="input"
            />
          </div>

          <span className="text-red-500 text-[12px]">
            {errors?.Businessname && errors?.Businessname?.message}
          </span>

          <div className="grid gap-2">
            <label className="label text flex">
              Store Address<span className="text-[#CB0000]">*</span>
            </label>
            <input
              type="text"
              id="Storeaddress"
              placeholder="Herbert Macaulay, Florida"
              {...register("Storeaddress", {
                required: "Required",
                pattern: {
                  value: /[A-Za-z0-9'\.\-\s\,]/,
                  message: "invalid address",
                },
              })}
              className="input"
            />
          </div>

          <span className="text-red-500 text-[12px]">
            {errors?.Storeaddress && errors?.Storeaddress?.message}
          </span>
          <div className="flex justify-between label parentinput gap-2">
            <label className="justify-start text-left max-[390px]:w-[170px] w-full grid">
              Country
              {/* <select className="max-[390px]:w-[170px] w-full border">
                {Countries?.map((country) => (
                  <option key={country.id}>{country.name}</option>
                ))}
              </select> */}
              <select className="max-[390px]:w-[170px] w-4/5 border" defaultValue="Country" onChange={handleCountryChange}>
              <option value = "Country" disabled>Country</option>
                {countries?.map((country) => (
                  <option key={country.id} value={country.iso2}>
                    {country.iso2}, {country.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="justify-end text-left grid max-[390px]:w-[170px] w-full">
              City/Province
              {/* <select className="max-[390px]:w-[170px] w-full border">
                {Countries?.map((country) => (
                  <option key={country.id}>{country.name}</option>
                ))}
              </select> */} 
              <select className="max-[390px]:w-[170px] w-full border" defaultValue="City">
                <option value = "City" disabled>City</option>
                {cities?.map((city) => (

                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <OnboardingButton text={"Submit"} />
        </form>
        <Terms />
      </div>
      {isLoading && <Loader />}
    </div>
  );
}

function Terms() {
  return (
    <div className="flex items-center gap-2">
      <input type="checkbox" />
      <p>
        Creating an account means you're okay with our{" "}
        <strong>Terms of Service, Privacy Policy</strong>, and our default{" "}
        <strong>Notification settings</strong>
      </p>
    </div>
  );
}
