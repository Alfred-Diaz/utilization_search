const FORMATTER = new Intl.NumberFormat('en-PH', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const PLACEHOLDER = '--';

const SUPABASE_FIELD_MAP = {
  identity: {
    name: 'name',
    company: 'company',
    memberNo: 'member_no',
    plan: 'plan',
    status: 'status'
  },
  memberDetails: {
    memberType: 'member_type',
    designation: 'designation',
    dob: 'dob',
    ageGender: 'age_gender',
    civilStatus: 'civil_status',
    memberStartDate: 'member_start_date',
    memberEndDate: 'member_end_date',
    hospitalAccess: 'hospital_access'
  },
  coverageDetails: {
    preExisting: 'pre_existing',
    maternity: 'maternity',
    dental: 'dental',
    hospitalAccess: 'hospital_access',
    clinicAccess: 'clinic_access',
    roomLimit: 'room_limit'
  },
  utilizationDetails: {
    mbl: 'mbl',
    ibnr: 'ibnr',
    processedClaims: 'processed_claims',
    remainingMbl: 'remaining_mbl'
  }
};

const SAMPLE_SUPABASE_RESPONSE = {
  name: 'MORAUDA, ANABEL SORIZO',
  company: 'THEL-FHP-25-1846 - THE LEGAL TECH COMPANY INC.',
  member_no: '1846-00136-03-01',
  plan: 'Flexi-health Protect',
  status: 'ACTIVE',
  member_type: 'Parent',
  designation: '--',
  dob: 'Jun 15, 1969',
  age_gender: '57 / Female',
  civil_status: 'Married',
  member_start_date: 'Jun 29, 2026',
  member_end_date: 'Sep 30, 2026',
  hospital_access: 'Any accredited hospitals',
  pre_existing: 'Covered',
  maternity: 'Pre and Post Natal Consult',
  dental: 'Not covered',
  clinic_access: 'Except Healthway Medical Clinic',
  room_limit: 'Regular Private',
  mbl: 150000,
  ibnr: 0,
  processed_claims: 0,
  remaining_mbl: 150000
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
  const identity = SUPABASE_FIELD_MAP.identity;
  const member = SUPABASE_FIELD_MAP.memberDetails;
  const coverage = SUPABASE_FIELD_MAP.coverageDetails;
  const utilization = SUPABASE_FIELD_MAP.utilizationDetails;

  return {
    name: valueFrom(source, identity.name),
    company: valueFrom(source, identity.company),
    memberNo: valueFrom(source, identity.memberNo),
    plan: valueFrom(source, identity.plan),
    status: valueFrom(source, identity.status, 'ACTIVE'),

    memberType: valueFrom(source, member.memberType),
    designation: valueFrom(source, member.designation),
    dob: valueFrom(source, member.dob),
    ageGender: valueFrom(source, member.ageGender),
    civilStatus: valueFrom(source, member.civilStatus),
    memberStartDate: valueFrom(source, member.memberStartDate),
    memberEndDate: valueFrom(source, member.memberEndDate),
    memberHospitalAccess: valueFrom(source, member.hospitalAccess),

    preExisting: valueFrom(source, coverage.preExisting),
    maternity: valueFrom(source, coverage.maternity),
    dental: valueFrom(source, coverage.dental),
    coverageHospitalAccess: valueFrom(source, coverage.hospitalAccess),
    clinicAccess: valueFrom(source, coverage.clinicAccess),
    roomLimit: valueFrom(source, coverage.roomLimit),

    mbl: amountFrom(source, utilization.mbl),
    ibnr: amountFrom(source, utilization.ibnr),
    processedClaims: amountFrom(source, utilization.processedClaims),
    remainingMbl: amountFrom(source, utilization.remainingMbl)
  };
}

function renderMember(payload) {
  const member = normalizeSupabasePayload(payload);

  setText('member-name', member.name);
  setText('member-company', member.company);
  setText('member-number', member.memberNo);
  setText('member-plan', member.plan);
  setText('member-status', member.status);

  setText('member-type', member.memberType);
  setText('designation', member.designation);
  setText('birth-date', member.dob);
  setText('age-gender', member.ageGender);
  setText('civil-status', member.civilStatus);
  setText('member-start-date', member.memberStartDate);
  setText('member-end-date', member.memberEndDate);
  setText('member-hospital-access', member.memberHospitalAccess);

  setText('pre-existing', member.preExisting);
  setText('maternity', member.maternity);
  setText('dental-benefit', member.dental);
  setText('coverage-hospital-access', member.coverageHospitalAccess);
  setText('clinic-access', member.clinicAccess);
  setText('room-limit', member.roomLimit);

  setText('mbl', formatAmount(member.mbl));
  setText('ibnr', formatAmount(member.ibnr));
  setText('processed-claims', formatAmount(member.processedClaims));
  setText('remaining-mbl', formatAmount(member.remainingMbl));
}

async function searchMember(searchValue, searchType) {
  setText('status-line', 'Searching member utilization data...');

  try {
    if (!window.client?.request?.invoke) {
      renderMember(SAMPLE_SUPABASE_RESPONSE);
      setText('status-line', 'Preview mode: sample Supabase holder data loaded.');
      return;
    }

    const response = await client.request.invoke('getMember', {
      search_value: searchValue,
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
  const searchValue = document.getElementById('member-search')?.value?.trim();
  const searchType = document.getElementById('search-type')?.value || 'member_no';

  if (!searchValue) {
    setText('status-line', 'Please enter a member number or name before searching.');
    return;
  }

  searchMember(searchValue, searchType);
});

renderMember(SAMPLE_SUPABASE_RESPONSE);
