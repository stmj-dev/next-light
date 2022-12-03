import React, {
  useEffect,
  useState,
} from 'react';

// import { useMediaQuery } from 'react-responsive';
import { faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ValidateComponent } from '../';

export default function SelectComponent({
  placeholder,
  name,
  icon,
  disabled,
  onFocus,
  onBlur,
  onChange,
  onClick,
  validate,
  error,
  setInputValue,
  label,
  options,
  className,
  searchable,
  onSearch,
  searchServer,
  onValidate,
  hideOption,
  loading
}) {
  const [focus, setFocus] = useState(false);
  const [value, setValue] = useState("");
  const [invalid, setInvalid] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [keydown, setKeydown] = useState(false);
  const [first, setFirst] = useState(true);

  useEffect(() => {
    setActiveSuggestion(-1);
    setFilteredSuggestions(options);
    setShowSuggestions(true);
  }, [options]);

  useEffect(() => {
    setInvalid(error);
  }, [error]);

  useEffect(() => {
    setValue(setInputValue);
  }, [setInputValue]);

  const filterSuggestion = (e) => {
    if (options && options[0]) {
      if (!searchable) {
        setActiveSuggestion(-1);
        setFilteredSuggestions(options);
        setShowSuggestions(true);
      } else {
        const filteredSuggestion = options.filter(
          (suggestion) =>
            suggestion.searchable ? suggestion.searchable
              .toLowerCase()
              .indexOf(e.target.value.toLowerCase()) > -1 :
              suggestion.label
                .toLowerCase()
                .indexOf(e.target.value.toLowerCase()) > -1
        );

        if (hideOption) {
          filteredSuggestion = filteredSuggestion.filter((val) => val.value != hideOption);
        }

        setActiveSuggestion(-1);
        setFilteredSuggestions(filteredSuggestion);
        setShowSuggestions(true);
      }
    }
  };

  const onKeyDownSuggestion = (e) => {
    if (options && options[0]) {
      if (e.keyCode === 13 && filteredSuggestions[0]) {
        e.preventDefault();

        setActiveSuggestion(-1);
        setFilteredSuggestions([]);
        setShowSuggestions(false);
        setValue(filteredSuggestions[activeSuggestion]?.label);
        if (onChange) {
          onChange(filteredSuggestions[activeSuggestion]);
        }
      } else if (e.keyCode === 38) {
        e.preventDefault();

        if (activeSuggestion === 0) {
          return;
        }

        setActiveSuggestion(activeSuggestion - 1);
        setValue(filteredSuggestions[activeSuggestion - 1]?.label);
      } else if (e.keyCode === 40) {
        e.preventDefault();

        if (activeSuggestion + 1 >= filteredSuggestions.length) {
          return;
        }

        setActiveSuggestion(activeSuggestion + 1);
        setValue(filteredSuggestions[activeSuggestion + 1]?.label);
      }
    }
  };

  return (
    <div className='relative'>
      <div
        className={`
          form__control
          ${disabled ? "opacity-60" : ""} 
          ${className}`}
      >
        {label && <label
          htmlFor={name + "_field"}
          className={`
            ${focus ? "text__primary" : ""}
            ${invalid ? "text__danger" : ""}
            ${loading ? "inline-block skeleton__loading min-w-[80px] mb-1" : ""}
          `}
        >
          {label}
        </label>}
        <input type="hidden" name={name} value={options.filter((option) => option.label == value).at(0) ? options.filter((option) => option.label == value).at(0).value : ""} />
        <div className={`relative ${loading ? "skeleton__loading" : ""}`}>
        <input
          readOnly={!searchable ? "readonly" : ""}
          value={value}
          id={name + "_field"}
            placeholder={placeholder}
          className={`
            ${icon ? "pl-16 pr-5" : "pl-5 pr-24"}
            ${invalid ? " invalid" : ""}
          `}
          name={""}
          disabled={disabled}
          onFocus={(e) => {
            setFocus(true);
            setShowSuggestions(true);

            if (searchable) {
              e.target.select()
            }

            if (!searchServer) {
              filterSuggestion(e);
            }

            if (onFocus) {
              onFocus();
            }
          }}
          onBlur={(e) => {
            setTimeout(() => {
              setFocus(false);
            }, 100);

            let suges = options.find(
              (suggestion) =>
                suggestion.label.toLowerCase() == e.target.value.toLowerCase()
            );

            setTimeout(() => {
              if (!keydown) {
                setValue(suges ? suges?.label : "");
                if (onChange) {
                  onChange(suges);
                }
              }
            }, 140);

            if (onBlur) {
              onBlur();
            }
          }}
          onChange={(e) => {
            setFirst(false);

            if (searchable) {
              setValue(e.target.value);
            }

            if (searchServer) {
              onSearch(e.target.value);
            } else {
              if (options && options[0]) {
                filterSuggestion(e);
              } else {
                onChange(e.target);
              }
            }
          }}
          onKeyDown={(e) => {
            if (options && options[0]) {
              onKeyDownSuggestion(e);
            }
          }}
          autoComplete='off'
        />


        {icon && (
          <FontAwesomeIcon
            className={`
              absolute left-1 ml-5 text-xl text-gray-400 top-1/2 -translate-y-1/2
              ${onClick && "cursor-pointer"} 
              ${focus ? "text__primary" : ""}
              ${invalid ? "text__danger" : ""}
            `}
            icon={icon}
            onClick={(e) => {
              if (onClick) {
                onClick(e);
              }
            }}
          />
        )}

        {value && (
          <FontAwesomeIcon
            className={`
              absolute right-16 text-xl text-gray-400 top-1/2 -translate-y-1/2
              ${onClick && "cursor-pointer"} 
              ${focus ? "text__primary" : ""}
              ${invalid ? "text__danger" : ""}
            `}
            icon={faTimes}
            onClick={(e) => {
              setValue("")
              onChange && onChange(null);
            }}
          />
        )}

        <label
          onClick={() => setFocus(!disabled ? !focus : false)}
            className='absolute mr-5 right-1 text-gray-400 top-1/2 -translate-y-1/2'>
          <FontAwesomeIcon
            className={`text-xl -mt-2 ${focus
              ? !invalid
                ? "text__primary"
                : "text__danger"
              : !invalid
                ? ""
                : "text__danger"
              }`}
            icon={faChevronDown}
            onClick={() => setFocus(true)}
          />
        </label>


        {!disabled && options && options[0] && showSuggestions && (
          <div>
            <ul
              className={`
                  absolute suggestions left-0 mt-4 rounded-xl w-full bg-gray-100 shadow text-left z-30 overflow-hidden py-3 ease-in-out 
                  ${focus ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}
              `}
            // style={{
            //   maxWidth: `calc(100% - ${icon ? "7.5rem" : "5.5rem"})`
            // }}
            >
              <ul
                  className='overflow-x-hidden overflow-y-auto scroll_control'
                style={{ maxHeight: "170px" }}>
                {filteredSuggestions.map((suggestion, index) => {
                  return (
                    <li
                      className={`
                        w-full px-5 py-3 list-none cursor font-medium hover__bg__light__primary cursor-pointer
                        ${index == activeSuggestion ? "bg__light__primary" : ""}
                      `}
                      key={index}
                      onMouseDown={() => {
                        setKeydown(true);
                        setTimeout(() => {
                          setFocus(true);
                        }, 110);

                        setValue(suggestion.label);
                      }}

                      onMouseUp={() => {
                        setFirst(false);
                        setKeydown(false);
                        setValue(suggestion.label);
                        setFilteredSuggestions([]);
                        setActiveSuggestion(index);
                        setShowSuggestions(false);
                        setInvalid(false);
                        setTimeout(() => {
                          setFocus(false);
                        }, 120);
                        if (onChange) {
                          onChange(suggestion);
                        }
                      }}
                    >
                      {!suggestion.customView
                        ? suggestion.label
                        : suggestion.customView}
                    </li>
                  );
                })}
              </ul>
            </ul>
          </div>
        )}
        </div>
        {validate && !first && (
          <ValidateComponent
            {...validate}
            value={value}
            setInvalid={(e) => {
              setInvalid(e);
              if (onValidate) {
                onValidate(e);
              }
            }}
          />
        )}
      </div>

      {invalid && (
        <small className='block text-sm text-left text__danger mt-2'>
          {invalid}
        </small>
      )}
    </div>
  );
}
