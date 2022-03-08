import { useState } from "react";
import { Nav } from "../components/Nav";

export const Onboarding = () => {

  const [formData, setFormData] = useState({
    user_id:'',
    first_name:'',
    dob_day:'',
    dob_month:'',
    dob_year:'',
    show_gender:false,
    gender_identity:'man',
    gender_interest:'woman',
    email:'',
    url:'',
    about:'',
    matches:[]
  })
  //handle submit function
  const handleSubmit = () => {
    console.log("Submit");

  };

  const handleChange = (e) => {
    const formValue = e.target.type === 'checkbox'? e.target.checked : e.target.value;
    const name = e.target.name;

    setFormData((prevState) => ({
      ...prevState,
      [name]:formValue
    }))

  };


  return (
    <>
      <Nav logoChooser={true} setShowModal={() => {}} showModal={false} />
      <div className="onboarding">
        <h2>CREATE ACCOUNT</h2>

        <form onSubmit={handleSubmit}>
          {/* left side section */}
          <section>
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              placeholder="first_name"
              required={true}
              value={formData.first_name}
              onChange={handleChange}
            />

            <label>Birthday</label>
            <div className="multiple-input-container">
              <input
                type="number"
                name="dob_day"
                id="dob_day"
                placeholder="DD"
                required={true}
                value={formData.dob_day}
                onChange={handleChange}
              />

              <input
                type="number"
                name="dob_month"
                id="dob_month"
                placeholder="MM"
                required={true}
                value={formData.dob_month}
                onChange={handleChange}
              />

              <input
                type="number"
                name="dob_year"
                id="dob_year"
                placeholder="YYYY"
                required={true}
                value={formData.dob_year}
                onChange={handleChange}
              />
            </div>

            <label>Gender</label>
            <div className="multiple-input-container">
              <input
                type="radio"
                name="gender_identity"
                id="man-gender-identity"
                value="man"
                onChange={handleChange}
                checked={formData.gender_identity === 'man'}
              />
              <label htmlFor="man-gender-identity">Man</label>
              <input
                type="radio"
                name="gender_identity"
                id="woman-gender-identity"
                value="woman"
                onChange={handleChange}
                checked={formData.gender_identity === 'woman'}
              />
              <label htmlFor="women-gender-identity">Women</label>
              <input
                type="radio"
                name="gender_identity"
                id="more-gender-identity"
                value="more"
                onChange={handleChange}
                checked={formData.gender_identity === 'more'}
              />
              <label htmlFor="more-gender-identity">More</label>
            </div>

            <label htmlFor="show-gender">Show gender on my profile</label>
            <input
              type="checkbox"
              name="show_gender"
              id="show-gender"
              onChange={handleChange}
              checked={formData.show_gender}
            />

            <label>Show Me</label>
            <div className="multiple-input-container">
              <input
                type="radio"
                name="gender_interest"
                id="man-gender-interest"
                value="man"
                onChange={handleChange}
                checked={formData.gender_interest === 'man'}
              />
              <label htmlFor="man-gender-interest">Man</label>
              <input
                type="radio"
                name="gender_interest"
                id="woman-gender-interest"
                value="woman"
                onChange={handleChange}
                checked={formData.gender_interest === 'woman'}
              />
              <label htmlFor="women-gender-interest">Woman</label>
              <input
                type="radio"
                name="gender_interest"
                id="everyone-gender-interest"
                value="everyone"
                onChange={handleChange}
                checked={formData.gender_interest === 'everyone'}
              />
              <label htmlFor="everyone-gender-interest">Everyone</label>
            </div>

            <label htmlFor="about">About</label>
            <input
              type="text"
              name="about"
              id="about"
              required={true}
              placeholder="I like long walks.."
              value={formData.about}
              onChange={handleChange}
            />
            <input type="submit" value="Submit" />
          </section>
          {/* right side section */}
          <section>
            <label htmlFor="photo">Profile Photo</label>
            <input
              type="url"
              name="url"
              id="url"
              onChange={handleChange}
              required={true}
            />
            <div className="photo-container"></div>
              <img src={formData.url} alt="No_picture" />
          </section>
        </form>
      </div>
    </>
  );
};
