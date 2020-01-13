import React, { useState } from 'react';
import { axiosWithAuth } from '../axiosWithAuth';

const initialColor = {
  color: '',
  code: { hex: '' }
};

const ColorList = ({ colors, updateColors, props }) => {
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [colorToAdd, setColorToAdd] = useState(initialColor);

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = e => {
    e.preventDefault();
    // Make a put request to save your updated color
    // think about where will you get the id from...
    // where is it saved right now?

    axiosWithAuth()
      .put(`http://localhost:5000/api/colors/${colorToEdit.id}`, colorToEdit)
      .then(res => {
        console.log('ColorList Updated Color', res.data);
        const filterUpdatedColor = colors.filter(
          color => color.id !== res.data.id
        );
        updateColors(
          [...filterUpdatedColor, res.data].sort(
            (a, b) => parseFloat(a.id) - parseFloat(b.id)
          )
        );
        setColorToEdit(initialColor);
        // props.history.push('/');
        props.history.push('/protected');
      })
      .catch(err => console.log(err));
  };

  const addColor = e => {
    e.preventDefault();
    axiosWithAuth()
      .post(`http://localhost:5000/api/colors`, colorToAdd)
      .then(res => {
        console.log(res);
        updateColors([...colors, colorToAdd])
        setColorToAdd(initialColor)
      })
      .catch(err => console.log(err));
    // let maxId = 0;
    // console.log(colors);
    // const largestId = colors.reduce(color => {
    //   if (color.id > maxId) {
    //     maxId = color.id;
    //   }
    // });
    // console.log('LargestID', largestId);
  };

  const deleteColor = color => {
    // make a delete request to delete this color
    console.log('Deleted Color', color);
    updateColors([...colors])
    axiosWithAuth()
      .delete(`http://localhost:5000/api/colors/${color.id}`)
      .then(res => {
        console.log('Color Deleted ID', res.data);
        const filterDeletedColor = colors.filter(
          color => color.id !== res.data
        );
        console.log('ColorList filterDeletedColor', filterDeletedColor);

        updateColors([...filterDeletedColor]);
        // props.history.push('/');
        props.history.push('/protected');
      });
  };

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span
                className="delete"
                onClick={e => {
                  e.stopPropagation();
                  deleteColor(color);
                }}
              >
                x
              </span>{' '}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      {/* <div className="spacer" /> */}
      {/* stretch - build another form here to add a color */}
      <form onSubmit={addColor}>
        <legend>add color</legend>
        <label>
          color name:
          <input
            onChange={e =>
              setColorToAdd({ ...colorToAdd, color: e.target.value })
            }
            value={colorToAdd.color}
          />
        </label>
        <label>
          hex code:
          <input
            onChange={e =>
              setColorToAdd({
                ...colorToAdd,
                code: { hex: e.target.value }
              })
            }
            value={colorToAdd.code.hex}
          />
        </label>
        <div className="button-row">
          <button type="submit">add</button>
          {/* <button onClick={() => setEditing(false)}>cancel</button> */}
        </div>
      </form>
    </div>
  );
};

export default ColorList;
