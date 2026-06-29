const FORMATTER = new Intl.NumberFormat('en-PH', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const PLACEHOLDER = '--';

const SUPABASE_FIELD_MAP = {
  member: {
    name: 'name',
    company: 'company',
    memberNo: 'member_no',
    plan: 'plan',
    status: 'status',
    department: 'department',
    designation: 'designation',
    memberType: 'member_type',
    birthDate: 'birth_date',
    ageGender: 'age_gender',
    civilStatus: 'civil_status',
    inceptionDate: 'inception_date',
    hospitalAccess: 'hospital_access',
    coveragePeriod: 'coverage_period',
    coveredBenefit: 'covered_benefit',
    preExisting: 'pre_existing',
    maternity: 'maternity',
    dental: 'dental',
    clinicAccess: 'clinic_access',
    roomLimit: 'room_limit'
  },
  amounts: {
    roomLimitAmount: 'room_limit_amount',
    mbl: 'mbl',
    ibnr: 'ibnr',
    reported: 'reported',
    available: 'available',
    maternityAmount: 'maternity_amount'
  },
  family: {
    rows: 'family_group',
    memberNo: 'member_no',
    name: 'name',
    type: 'type',
    age: 'age',
    gender: 'gender',
    civilStatus: 'civil_status',
    coveredBenefit: 'covered_benefit',
    ibnr: 'ibnr',
    reported: 'reported',
    medDental: 'med_dental',
    optical: 'optical'
  }
};

const SAMPLE_SUPABASE_RESPONSE = {
  name: 'MORAUDA, ANABEL SORIZO',
  company: 'THEL-FHP-25-1846 - THE LEGAL TECH COMPANY INC.',
  member_no: '1846-00136-03-01',
  plan: 'Flexi-health Protect',
  status: 'ACTIVE',
  department: '--',
  designation: '--',
  member_type: 'Parent',
  birth_date: 'Jun 15, 1969',
  age_gender: '57 / Female',
  civil_status: 'Married',
  inception_date: 'Jun 29, 2026',
  hospital_access: 'Any accredited hospitals',
  coverage_period: 'Jun 29, 2026 to Sep 30, 2026',
  covered_benefit: 'Full',
  pre_existing: 'Covered',
  maternity: 'Pre and Post Natal Consult',
  dental: 'Not covered',
  clinic_access: 'Except Healthway Medical Clinic',
  room_limit: 'Regular Private',
  room_limit_amount: 150000,
  mbl: 150000,
  ibnr: 0,
  reported: 0,
  available: 150000,
  maternity_amount: 150000,
  family_group: [
    {
      member_no: '1846-00136-03-01',
      name: 'MORAUDA, ANABEL SORIZO',
      type: 'Parent',
      age: 57,
      gender: 'Female',
      civil_status: 'MARRIED',
      covered_benefit: 'Full',
      ibnr: 0,
      reported: 0,
      med_dental: 0,
      optical: 0
    },
    {
      member_no: '1846-00136-00-00',
      name: 'MORAUDA, ANA CECILIA SORIZO',
      type: 'Principal',
      age: 30,
      gender: 'Female',
      civil_status: 'SINGLE',
      covered_benefit: 'Full',
      ibnr: 0,
      reported: 0,
      med_dental: 0,
      optical: 0
    }
  ]
};

function valueFrom(data, key, fallback = PLACEHOLDER) {
  const value = data?.[key];
  return value === null || value === undefined || value === '' ? fallback : value;
}

function amountFrom(data, key) {
  return Number(data?.[key] || 0);
}

function formatAmount(value) {
  return FORMATTER.format(Number(value || 0));
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function normalizeSupabasePayload(payload) {
  const source = payload?.data || payload?.response || payload?.member || payload || {};
  const memberMap = SUPABASE_FIELD_MAP.member;
  const amountMap = SUPABASE_FIELD_MAP.amounts;
  const familyMap = SUPABASE_FIELD_MAP.family;

  return {
    name: valueFrom(source, memberMap.name),
    company: valueFrom(source, memberMap.company),
    memberNo: valueFrom(source, memberMap.memberNo),
    plan: valueFrom(source, memberMap.plan),
    status: valueFrom(source, memberMap.status, 'ACTIVE'),
    department: valueFrom(source, memberMap.department),
    designation: valueFrom(source, memberMap.designation),
    memberType: valueFrom(source, memberMap.memberType),
    birthDate: valueFrom(source, memberMap.birthDate),
    ageGender: valueFrom(source, memberMap.ageGender),
    civilStatus: valueFrom(source, memberMap.civilStatus),
    inceptionDate: valueFrom(source, memberMap.inceptionDate),
    hospitalAccess: valueFrom(source, memberMap.hospitalAccess),
    coveragePeriod: valueFrom(source, memberMap.coveragePeriod),
    coveredBenefit: valueFrom(source, memberMap.coveredBenefit),
    preExisting: valueFrom(source, memberMap.preExisting),
    maternity: valueFrom(source, memberMap.maternity),
    dental: valueFrom(source, memberMap.dental),
    clinicAccess: valueFrom(source, memberMap.clinicAccess),
    roomLimit: valueFrom(source, memberMap.roomLimit),
    roomLimitAmount: amountFrom(source, amountMap.roomLimitAmount),
    mbl: amountFrom(source, amountMap.mbl),
    ibnr: amountFrom(source, amountMap.ibnr),
    reported: amountFrom(source, amountMap.reported),
    available: amountFrom(source, amountMap.available),
    maternityAmount: amountFrom(source, amountMap.maternityAmount),
    family: Array.isArray(source?.[familyMap.rows]) ? source[familyMap.rows] : []
  };
}

function renderMember(payload) {
  const member = normalizeSupabasePayload(payload);

  setText('member-name', member.name);
  setText('member-company', member.company);
  setText('member-number', member.memberNo);
  setText('member-plan', member.plan);
  setText('member-status', member.status);

  setText('room-limit-card', member.roomLimit);
  setText('mbl-card', formatAmount(member.mbl));
  setText('maternity-card', member.maternity);
  setText('maternity-amount-card', formatAmount(member.maternityAmount || member.available));
  setText('ibnr-card', formatAmount(member.ibnr));
  setText('covered-benefit-card', member.coveredBenefit);
  setText('available-card', formatAmount(member.available));

  setText('department', member.department);
  setText('designation', member.designation);
  setText('member-type', member.memberType);
  setText('birth-date', member.birthDate);
  setText('age-gender', member.ageGender);
  setText('civil-status', member.civilStatus);
  setText('inception-date', member.inceptionDate);
  setText('hospital-access', member.hospitalAccess);
  setText('coverage-period', member.coveragePeriod);
  setText('covered-benefit', member.coveredBenefit);
  setText('pre-existing', member.preExisting);
  setText('maternity', member.maternity);
  setText('dental-benefit', member.dental);
  setText('clinic-access', member.clinicAccess);
  setText('room-limit', member.roomLimit);
  setText('room-limit-amount', formatAmount(member.roomLimitAmount));
  setText('mbl', formatAmount(member.mbl));
  setText('ibnr', formatAmount(member.ibnr));
  setText('reported', formatAmount(member.reported));
  setText('available', formatAmount(member.available));

  renderFamily(member.family);
}

function renderFamily(rows) {
  const body = document.getElementById('family-body');
  if (!body) return;

  const familyMap = SUPABASE_FIELD_MAP.family;
  const visibleRows = rows.filter(row => {
    return row && (
      row[familyMap.memberNo] ||
      row[familyMap.name] ||
      Number(row[familyMap.ibnr] || 0) !== 0 ||
      Number(row[familyMap.reported] || 0) !== 0 ||
      Number(row[familyMap.medDental] || 0) !== 0 ||
      Number(row[familyMap.optical] || 0) !== 0
    );
  });

  const totals = {
    ibnr: 0,
    reported: 0,
    medDental: 0,
    optical: 0
  };

  const dependentTotals = {
    ibnr: 0,
    reported: 0,
    medDental: 0,
    optical: 0
  };

  body.innerHTML = visibleRows.map(row => {
    const ibnr = Number(row[familyMap.ibnr] || 0);
    const reported = Number(row[familyMap.reported] || 0);
    const medDental = Number(row[familyMap.medDental] || 0);
    const optical = Number(row[familyMap.optical] || 0);
    const type = valueFrom(row, familyMap.type);

    totals.ibnr += ibnr;
    totals.reported += reported;
    totals.medDental += medDental;
    totals.optical += optical;

    if (!['principal', 'parent'].includes(String(type).toLowerCase())) {
      dependentTotals.ibnr += ibnr;
      dependentTotals.reported += reported;
      dependentTotals.medDental += medDental;
      dependentTotals.optical += optical;
    }

    return `
      <tr>
        <td>${valueFrom(row, familyMap.memberNo)}</td>
        <td>${valueFrom(row, familyMap.name)}</td>
        <td>${type}</td>
        <td>${valueFrom(row, familyMap.age)}</td>
        <td>${valueFrom(row, familyMap.gender)}</td>
        <td>${valueFrom(row, familyMap.civilStatus)}</td>
        <td>${valueFrom(row, familyMap.coveredBenefit)}</td>
        <td>${formatAmount(ibnr)}</td>
        <td>${formatAmount(reported)}</td>
        <td>${formatAmount(medDental)}</td>
        <td>${formatAmount(optical)}</td>
      </tr>
    `;
  }).join('');

  setText('family-count', `(${visibleRows.length} Member(s))`);
  setText('total-ibnr', formatAmount(totals.ibnr));
  setText('total-reported', formatAmount(totals.reported));
  setText('total-med-dental', formatAmount(totals.medDental));
  setText('total-optical', formatAmount(totals.optical));
  setText('dep-total-ibnr', formatAmount(dependentTotals.ibnr));
  setText('dep-total-reported', formatAmount(dependentTotals.reported));
  setText('dep-total-med-dental', formatAmount(dependentTotals.medDental));
  setText('dep-total-optical', formatAmount(dependentTotals.optical));
}

async function searchMember(memberSearch, searchType) {
  setText('status-line', 'Searching member utilization data...');

  try {
    if (!window.client?.request?.invoke) {
      renderMember(SAMPLE_SUPABASE_RESPONSE);
      setText('status-line', 'Preview mode: sample Supabase holder data loaded.');
      return;
    }

    const response = await client.request.invoke('getMember', {
      search_value: memberSearch,
      search_type: searchType
    });

    renderMember(response);
    setText('status-line', 'Member utilization details loaded successfully.');
  } catch (error) {
    console.error(error);
    setText('status-line', 'Unable to load member utilization details. Please verify the search value.');
  }
}

document.getElementById('member-search-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const memberSearch = document.getElementById('member-search')?.value?.trim();
  const searchType = document.getElementById('search-type')?.value || 'member_no';

  if (!memberSearch) {
    setText('status-line', 'Please enter a member number, name, or company before searching.');
    return;
  }

  searchMember(memberSearch, searchType);
});

renderMember(SAMPLE_SUPABASE_RESPONSE);
