import React, { useState, useEffect } from "react";
import AppStyles from "./styles/App.module.css";

import plusSvg from "./icons/Plus.svg";
import CloseSvg from "./icons/Close Square.svg";

import axios from "axios";

function App() {
  useEffect(() => {
    const id = localStorage.getItem("userId");

    if (!id) {
      axios.get("/api/v1/user/id").then(({ data }) => {
        const user = data.data.user;
        localStorage.setItem("userId", user);
      });
    }
  }, []);

  const [inputFields, setInputFields] = useState([
    { url: "", tags: "", text: "" },
  ]);

  const changeInput = (index, e) => {
    const data = [...inputFields];
    const dataObj = data[index];
    dataObj[e.target.name] = e.target.value;
    // add a debounce/throttle here
    setInputFields(data);
  };

  const addMoreFields = () => {
    const obj = { url: "", tags: "", text: "" };
    const data = [...inputFields, obj];
    setInputFields(data);
  };

  const removeField = (id) => {
    const data = [...inputFields];
    data.splice(id, 1);
    setInputFields(data);
  };

  const submitForm = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const options = {
        headers: {
          "content-type": "application/json",
        },
      };

      // send to backend
      if (userId) {
        await axios.post(
          `/api/v1/user/${userId}/upload`,
          {
            data: inputFields,
          },
          options
        );
      }
    } catch (err) {
      console.log(err.message);
    }

    setInputFields([{ url: "", tags: "", text: "" }]);
  };

  return (
    <div className="App">
      <div className={AppStyles.form}>
        {inputFields.map((fields, index) => {
          return (
            <div className={AppStyles.single__form} key={index}>
              <div className={AppStyles.close__btn}>
                <img
                  src={CloseSvg}
                  alt="close btn"
                  onClick={() => removeField(index)}
                />
              </div>
              <div className={AppStyles.form__field}>
                <label htmlFor="url">url</label>
                <input
                  type="text"
                  name="url"
                  value={fields.url}
                  onChange={(e) => {
                    changeInput(index, e);
                  }}
                />
              </div>
              <div className={AppStyles.form__field}>
                <label htmlFor="tags">tags</label>
                <input
                  type="text"
                  name="tags"
                  value={fields.tags}
                  onChange={(e) => {
                    changeInput(index, e);
                  }}
                />
              </div>
              <div className={AppStyles.form__field}>
                <label htmlFor="additionalText">texts</label>
                <input
                  type="text"
                  name="text"
                  value={fields.text}
                  onChange={(e) => {
                    changeInput(index, e);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className={AppStyles.form__icons}>
        <div className={AppStyles.add__form} onClick={addMoreFields}>
          <img src={plusSvg} alt="add more field" />
        </div>

        <div className={AppStyles.submit__form}>
          <button onClick={submitForm}>Submit Form</button>
        </div>
      </div>
    </div>
  );
}

export default App;
