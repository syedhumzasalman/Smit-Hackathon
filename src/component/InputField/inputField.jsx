import React from 'react'

const InputField = ({ type, text, className, onChange, value }) => {
  return (
    <input
      type={type}
      placeholder={text}
      onChange={onChange}
      value={value}
      className={`${className} w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none`}
    />
  )
}

export default InputField
