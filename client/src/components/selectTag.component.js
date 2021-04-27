import React, { useState } from "react";
import MultiSelect from "react-multi-select-component";

const SelectTag = (props) => {
  const options = [];
  props.tags.map((tag) => options.push({ label: tag.label, value: tag.key }));

  const defaultSelectedOptions = props.tagsSelected.map((stag) => {
    return options.filter((tag) => tag.value === stag)[0];
  });

  const [selected, setSelected] = useState(defaultSelectedOptions);

  const overrideStrings = {
    allItemsAreSelected: "Todas as tags estão relacionadas",
    clearSearch: "Limpar pesquisa",
    noOptions: "Sem opções",
    search: "Pesquisar",
    selectAll: "Selecionar todos",
    selectSomeItems: "Selecionar...",
  };

  return (
    <div>
      <MultiSelect
        options={options}
        value={selected}
        onChange={(e) => {
          setSelected(e);
          props.onChangeValue(e, props.repositoryId);
        }}
        labelledBy="Select"
        overrideStrings={overrideStrings}
      />
    </div>
  );
};

export default SelectTag;
