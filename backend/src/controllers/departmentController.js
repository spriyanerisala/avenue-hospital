import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { store } from '../utils/dataStore.js';

export const getDepartments = async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      return res.status(200).json({ success: true, departments: data });
    }

    return res.status(200).json({
      success: true,
      departments: store.departments.filter(d => d.is_active)
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return res.status(500).json({ success: false, message: 'Could not fetch departments' });
  }
};

export const getDepartmentBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (isSupabaseConfigured) {
      const { data: department, error } = await supabase
        .from('departments')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !department) {
        return res.status(404).json({ success: false, message: 'Department not found' });
      }

      const { data: doctors } = await supabase
        .from('doctors')
        .select('*')
        .eq('department_id', department.id)
        .eq('is_active', true);

      return res.status(200).json({ success: true, department: { ...department, doctors: doctors || [] } });
    }

    const dept = store.departments.find(d => d.slug === slug || d.id === slug);
    if (!dept) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    const deptDoctors = store.doctors.filter(d => d.department_id === dept.id && d.is_active);
    return res.status(200).json({
      success: true,
      department: { ...dept, doctors: deptDoctors }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving department' });
  }
};
