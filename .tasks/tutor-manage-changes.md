# UI changes requirements in add tutor page

### - [ ] Add Subject and classes:
- Current implement has subject multi select dropdown followed by class selection. 
- As per our db schema, a subject can belong to multiple classes.
- So instead of single dropdown, we have to implement multiple select with dynamic list.
- Add a new "Add Subject" button, once clicked, add a new section with follow input binded inside fieldset, legend to separate the subjects.
    - Form includes following:
    1. switch toggle to select if the subject is academic or not.
    2. Searchable dropdown for subject with single select.
    3. If isAcademic is false then show multi-select class dropdown, this will not be searchable, the classes select value will be fetched from seleced class object.
    4. If isAcademic is true then user can enter from age to To age. So there will be 2 input with validation: from age shall not be greater than to age.
- We can add a new subject, edit and also delete, so for every section there will be delete icon at top-right of the section.
- Check out the classes and subjects schema to fetch the subject and classes info from the API which shall be used by the add/edit tutor form.
- For tutor subjects schema update the model to support this type for data.
