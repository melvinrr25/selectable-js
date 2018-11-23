# selectable-js
Nice-looking HTML dropdowns (select multiple) 

#Example

## index.html
```html
<select id="my-option1" name="student[books][]" multiple="multiple"> 
  <option value="Matematicas">Matematicas</option>
  <option selected='selected' value="Ciencias">Ciencias</option>
  <option value="Estudios Sociales">Estudios Sociales</option>
  <option value="Programacion">Programacion</option>
  <option value="Religion">Religion</option>
</select>

<script src='selectable.js'></script>

<script>
  // Get the select node
  var select = document.querySelector('#my-option1');
  // Make it selectable
  select.selectable();
</script> 
```

## Result

![alt text](https://raw.githubusercontent.com/melvinrr25/selectable-js/master/example.gif)
