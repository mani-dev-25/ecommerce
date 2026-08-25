import React from 'react';

const STATES = [
  'Andhra Pradesh','Delhi','Goa','Gujarat','Haryana','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Punjab','Rajasthan',
  'Tamil Nadu','Telangana','Uttar Pradesh','West Bengal',
];

const BillingForm = ({ data, onChange, errors, title, sectionNum }) => {
  const field = (id, label, placeholder, type = 'text', autoComplete = '') => (
    <div className="checkout-field" key={id}>
      <label className="checkout-label" htmlFor={`${sectionNum}-${id}`}>{label}</label>
      <input
        id={`${sectionNum}-${id}`}
        type={type}
        name={id}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`checkout-input${errors[id] ? ' is-invalid' : ''}`}
        value={data[id] || ''}
        onChange={onChange}
      />
      {errors[id] && <span className="checkout-error">{errors[id]}</span>}
    </div>
  );

  return (
    <div className="checkout-card">
      <h2 className="checkout-section-title">
        <span className="checkout-section-num">{sectionNum}</span>
        {title}
      </h2>

      <div className="row g-3">
        <div className="col-12 col-sm-6">
          {field('firstName', 'First Name', 'John', 'text', 'given-name')}
        </div>
        <div className="col-12 col-sm-6">
          {field('lastName', 'Last Name', 'Doe', 'text', 'family-name')}
        </div>
        <div className="col-12">
          {field('email', 'Email Address', 'you@example.com', 'email', 'email')}
        </div>
        <div className="col-12">
          {field('phone', 'Phone Number', '+91 98765 43210', 'tel', 'tel')}
        </div>
        <div className="col-12">
          {field('addressLine1', 'Address Line 1', 'House/Flat no., Building name', 'text', 'address-line1')}
        </div>
        <div className="col-12">
          {field('addressLine2', 'Address Line 2 (Optional)', 'Street, Area', 'text', 'address-line2')}
        </div>
        <div className="col-12 col-sm-6">
          {field('city', 'City', 'Mumbai', 'text', 'address-level2')}
        </div>
        <div className="col-12 col-sm-6">
          <div className="checkout-field">
            <label className="checkout-label" htmlFor={`${sectionNum}-state`}>State</label>
            <select
              id={`${sectionNum}-state`}
              name="state"
              className={`checkout-select${errors.state ? ' is-invalid' : ''}`}
              value={data.state || ''}
              onChange={onChange}
            >
              <option value="">Select state</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.state && <span className="checkout-error">{errors.state}</span>}
          </div>
        </div>
        <div className="col-12 col-sm-6">
          {field('pincode', 'PIN Code', '400001', 'text', 'postal-code')}
        </div>
      </div>
    </div>
  );
};

export default BillingForm;
